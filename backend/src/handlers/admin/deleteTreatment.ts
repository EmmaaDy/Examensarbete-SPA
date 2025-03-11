import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../../services/db'; // För att använda DynamoDB
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

export const deleteTreatment = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Kontrollera att Authorization-headern finns
    const token = event.headers['Authorization']?.split(' ')[1] || event.headers['authorization']?.split(' ')[1];
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Authorization token is required' }),
      };
    }

    // Verifiera JWT-token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { username: string, role: string };
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid or expired token' }),
      };
    }

    // Kontrollera om användaren är admin
    if (decoded.role !== 'admin') {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden: Only admins can delete treatments' }),
      };
    }

    // Hämta treatmentId från URL-path
    const treatmentId = event.pathParameters?.id;
    if (!treatmentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Treatment ID is required' }),
      };
    }

    // Radera behandlingen
    const deleteCommand = new DeleteCommand({
      TableName: 'Treatments',
      Key: { treatmentId: treatmentId },
    });

    await db.send(deleteCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Treatment deleted successfully', treatmentId }),
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
