import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../../services/db'; // För att använda DynamoDB
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

export const updateTreatment = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Kontrollera JWT-token från headern
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
        body: JSON.stringify({ message: 'Forbidden: Only admins can update treatments' }),
      };
    }

    // Hämta ID från URL-path
    const treatmentId = event.pathParameters?.id;
    if (!treatmentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Treatment ID is required' }),
      };
    }

    // Hämta nya data från request body
    const { name, description, price, duration, category } = JSON.parse(event.body || '{}');
    if (!name || !description || !price || !duration || !category) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'All fields (name, description, price, duration, category) are required' }),
      };
    }

    // Få dagens datum och tid
    const updatedAt = new Date().toISOString(); // Exempel: 2024-12-19T15:30:00.000Z

    // Uppdatera behandlingen i DynamoDB med alias för reserverade ord
    const updateCommand = new UpdateCommand({
      TableName: 'Treatments',
      Key: { treatmentId: treatmentId }, // Använd treatmentId istället för id
      UpdateExpression: 'SET #name = :name, #description = :description, #price = :price, #duration = :duration, #category = :category, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#description': 'description',
        '#price': 'price',
        '#duration': 'duration',  // Alias för reserverade ord
        '#category': 'category',
        '#updatedAt': 'updatedAt',  // Alias för att hantera "updatedAt"
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':description': description,
        ':price': price,
        ':duration': duration,
        ':category': category,
        ':updatedAt': updatedAt, // Sätt updatedAt till det aktuella datumet
      },
      ReturnValues: 'ALL_NEW', // Retur alla nya attribut efter uppdateringen
    });

    const result = await db.send(updateCommand);

    if (!result.Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Treatment not found' }),
      };
    }

    // Framgångsrikt uppdaterad behandling
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Treatment updated successfully',
        treatment: result.Attributes,
      }),
    };
  } catch (error: unknown) {
    // Hantera oväntade fel
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
