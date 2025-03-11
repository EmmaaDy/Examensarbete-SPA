import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../../services/db';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

export const createTreatment = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2)); // Log the entire event
    console.log("Full event headers:", event.headers); // Log all headers to see their content

    // Kontrollera om body finns
    if (!event.body) {
      console.error("No body in request.");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Request body is required' }),
      };
    }

    // Logga den inkommande body för att se exakt vad som skickas
    console.log("Request body:", event.body);

    // Extrahera och verifiera JWT-token från Authorization-headern
    const token = event.headers['Authorization']?.split(' ')[1] || event.headers['authorization']?.split(' ')[1];
    console.log("Authorization token:", token); // Log token for debugging

    if (!token) {
      console.error("No token provided.");
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Authorization token is required' }),
      };
    }

    // Verifiera token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { username: string, role: string };
      console.log("Decoded JWT:", decoded); // Log the decoded token
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid or expired token' }),
      };
    }

    // Kontrollera om användaren är admin
    if (decoded.role !== 'admin') {
      console.error("User is not an admin.");
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden: Only admins can create treatments' }),
      };
    }

    // Parse body och kontrollera för nödvändiga fält
    let body;
    try {
      body = JSON.parse(event.body);
      console.log("Request body parsed:", body);
    } catch (error) {
      console.error("Error parsing body:", error);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid JSON format in request body' }),
      };
    }

    const { treatmentId, treatmentName, description, price, category, duration } = body;

    // Kontrollera att alla nödvändiga fält finns
    if (!treatmentId || !treatmentName || !description || !price || !category || !duration) {
      console.error("Missing required fields:", { treatmentId, treatmentName, description, price, category, duration });
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    // Logga värdena på de skickade fälten
    console.log("Treatment data:", { treatmentId, treatmentName, description, price, category, duration });

    // Validera att price och duration är siffror
    if (isNaN(price) || isNaN(duration)) {
      console.error("Invalid price or duration", { price, duration });
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Price and duration must be valid numbers' }),
      };
    }

    // Förbered DynamoDB-parametrar
    const treatmentParams = {
      TableName: 'Treatments',
      Item: {
        treatmentId: { S: treatmentId },
        treatmentName: { S: treatmentName }, // Använd treatmentName istället för name
        description: { S: description },
        price: { N: price.toString() },
        category: { S: category },
        duration: { N: duration.toString() },
      },
    };

    // Logga data innan vi försöker spara i DynamoDB
    console.log("DynamoDB params:", treatmentParams);

    // Infoga i DynamoDB
    try {
      await db.send(new PutItemCommand(treatmentParams));
      console.log("Treatment created successfully:", treatmentId);
    } catch (dbError) {
      console.error("DynamoDB error:", dbError);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error saving treatment to DynamoDB', error: dbError }),
      };
    }

    // Retur framgångs-svar
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Treatment created successfully',
        treatment: { treatmentId, treatmentName, description, price, category, duration },
      }),
    };
  } catch (error: unknown) {
    // Hantera oväntade fel
    if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Unexpected error occurred', error: error.message }),
      };
    }
    console.error("Unexpected error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Unexpected error occurred' }),
    };
  }
};
