import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../../services/db';
import { UpdateItemCommand, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { ReturnValue } from '@aws-sdk/client-dynamodb';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Definiera JWT-payload typ
interface CustomJwtPayload extends JwtPayload {
  role: string; // Lägg till `role` fältet för att verifiera administratör
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Funktion för att uppdatera status på en bokning
export const updateBookingStatus = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const token = event.headers['Authorization']?.split(' ')[1] || event.headers['authorization']?.split(' ')[1];

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized: No token provided' }),
      };
    }

    let decoded: CustomJwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized: Invalid token' }),
      };
    }

    if (decoded.role !== 'admin') {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden: Admin access only' }),
      };
    }

    if (typeof event.body !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request body format' }),
      };
    }

    const body = JSON.parse(event.body);
    const { bookingId, status, treatmentId } = body;

    const validStatuses = ['Pending', 'Confirmed', 'Cancelled', 'No Show', 'Completed'];
    if (!validStatuses.includes(status)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid status' }),
      };
    }

    if (!bookingId || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields: bookingId or status' }),
      };
    }

    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    // Hämta den aktuella bokningen
    const getBookingParams = {
      TableName: 'Bookings',
      Key: { bookingId: { S: bookingId } },
    };
    const bookingResult = await db.send(new GetItemCommand(getBookingParams));
    if (!bookingResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Booking not found' }),
      };
    }

    const previousStatus = bookingResult.Item.status?.S || 'Unknown';

    // Logga statusändring
    console.log(`Booking ${bookingId} status changed from ${previousStatus} to ${normalizedStatus}`);

    // Hämta behandlingens pris om status är "No Show"
    let treatmentPrice = 0;
    if (normalizedStatus === 'No Show' && treatmentId) {
      const getTreatmentParams = {
        TableName: 'Treatments',
        Key: { treatmentId: { S: treatmentId } },
      };

      const treatmentResult = await db.send(new GetItemCommand(getTreatmentParams));
      if (treatmentResult.Item && treatmentResult.Item.price?.N) {
        treatmentPrice = parseInt(treatmentResult.Item.price.N, 10);
      } else {
        console.warn('Treatment price not found for treatmentId:', treatmentId);
      }
    }

    // Uppdatera status för bokningen
    const updateParams = {
      TableName: 'Bookings',
      Key: { bookingId: { S: bookingId } },
      UpdateExpression: 'SET #status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': { S: normalizedStatus } },
      ReturnValues: ReturnValue.ALL_NEW,
    };

    const result = await db.send(new UpdateItemCommand(updateParams));

    // Kontrollera om betalningen redan existerar
    let paymentRequired = false;
    if (normalizedStatus === 'No Show' && treatmentPrice > 0) {
      const getPaymentParams = {
        TableName: 'Payments',
        Key: { paymentId: { S: `payment-${bookingId}` } },
      };
      const paymentCheck = await db.send(new GetItemCommand(getPaymentParams));

      if (!paymentCheck.Item) {
        // Skapa betalning om den inte redan existerar
        const paymentParams = {
          TableName: 'Payments',
          Item: {
            paymentId: { S: `payment-${bookingId}` },
            bookingId: { S: bookingId },
            amount: { N: treatmentPrice.toString() },
            status: { S: 'Pending' },
          },
        };

        try {
          await db.send(new PutItemCommand(paymentParams));
          console.log('Payment created for booking:', bookingId);
          paymentRequired = true;
        } catch (error) {
          console.error('Error creating payment record:', error);
          return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error creating payment record' }),
          };
        }
      } else {
        console.log('Payment already exists for booking:', bookingId);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Booking status updated successfully',
        bookingId,
        previousStatus,
        newStatus: normalizedStatus,
        ...(paymentRequired
          ? { paymentRequired: true, amount: treatmentPrice }
          : { paymentRequired: false }),
      }),
    };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
