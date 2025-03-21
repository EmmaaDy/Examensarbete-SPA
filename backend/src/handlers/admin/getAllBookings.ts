import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../../services/db'; 
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

export const getAllBookings = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Extract token from authorization header
    const token = event.headers['Authorization']?.split(' ')[1] || event.headers['authorization']?.split(' ')[1];
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Authorization token is required' }),
      };
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { username: string, role: string };
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid or expired token' }),
      };
    }

    // Check if the user has admin role
    if (decoded.role !== 'admin') {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden: Only admins can view bookings' }),
      };
    }

    // Scan the 'Bookings' table in DynamoDB
    const scanCommand = new ScanCommand({
      TableName: 'Bookings',
    });

    const data = await db.send(scanCommand);

    // Debugging: Check and log the raw data received from DynamoDB
    console.log("DynamoDB scan result:", JSON.stringify(data.Items, null, 2));

    // Check if there are no items in the bookings
    if (!data.Items || data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No bookings found' }),
      };
    }

    // Map the DynamoDB data to include additional fields like room, price, paymentMethod, staffName, and duration
    const bookings = data.Items.map((item: any) => {
      console.log("Processing item:", JSON.stringify(item, null, 2)); 

      return {
        bookingId: item.bookingId.S,
        treatmentName: item.treatmentName.S,
        customerName: item.name.S,
        room: item.room?.S || 'General Room',
        price: item.price?.N ? parseFloat(item.price.N) : 0,
        status: item.status?.S || 'Pending',
        paymentMethod: item.paymentMethod?.S || 'Not Specified',
        staffName: item.employee?.S || 'Not Assigned',
        date: item.date.S,
        time: item.time.S,
        duration: item.duration?.N ? parseInt(item.duration.N) : 0, 
      };
    });

    // Return the bookings data
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Bookings fetched successfully',
        bookings: bookings,
      }),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Unexpected error occurred', error: error.message }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Unexpected error occurred' }),
    };
  }
};
