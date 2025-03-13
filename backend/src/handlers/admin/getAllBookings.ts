import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../../services/db'; // Anslut till DynamoDB
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

export const getAllBookings = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const token = event.headers['Authorization']?.split(' ')[1] || event.headers['authorization']?.split(' ')[1];
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Authorization token is required' }),
      };
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { username: string, role: string };
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid or expired token' }),
      };
    }

    if (decoded.role !== 'admin') {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden: Only admins can view bookings' }),
      };
    }

    const scanCommand = new ScanCommand({
      TableName: 'Bookings',
    });

    const data = await db.send(scanCommand);

    if (!data.Items || data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No bookings found' }),
      };
    }

    const bookings = data.Items.map((item: any) => ({
      bookingId: item.bookingId.S,
      treatmentName: item.treatmentName.S,
      date: item.date.S,
      time: item.time.S,
      customerName: item.name.S,
    }));

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
