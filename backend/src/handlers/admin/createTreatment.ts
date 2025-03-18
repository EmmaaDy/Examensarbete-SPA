import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../../services/db';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

// Fördefinierade rum
const validRooms = [
  'Indoor Sauna',
  'Outdoor Sauna',
  'Face Care Treatment',
  'Himalayan Salt Massage',
  'Massage room',
  'Bubble Pool & Relax Area'
];

// Define Treatment type and EmployeesTreatments structure
type Treatment = {
  treatmentId: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  room: string; 
};


type EmployeesTreatments = {
  [employee: string]: Treatment[];
};

const employeesTreatments: EmployeesTreatments = {
  Victoria: [
    { treatmentId: '4', name: 'Hydrating Facial', price: 70, duration: 45, category: 'Face Care Treatment', room: 'Face Care Treatment' },
    { treatmentId: '5', name: 'Anti-Aging Facial', price: 90, duration: 60, category: 'Face Care Treatment', room: 'Face Care Treatment' },
  ],
  Emma: [
    { treatmentId: '1', name: 'Relaxing Spa Massage', price: 75, duration: 60, category: 'Massage Treatments', room: 'Massage room' },
    { treatmentId: '2', name: 'Himalayan Salt Massage', price: 85, duration: 60, category: 'Massage Treatments', room: 'Massage room' },
    { treatmentId: '3', name: 'Deep Tissue Massage', price: 80, duration: 60, category: 'Massage Treatments', room: 'Massage room' },
  ],
  Isabella: [
    { treatmentId: '6', name: 'Body Scrub & Hydration', price: 85, duration: 60, category: 'Body Care Treatments', room: 'Body Care Treatments' },
    { treatmentId: '7', name: 'Aromatherapy Wrap', price: 80, duration: 45, category: 'Body Care Treatments', room: 'Body Care Treatments' },
  ],
  Olivia: [
    { treatmentId: '8', name: 'Indoor Sauna Session', price: 50, duration: 60, category: 'Sauna Experiences', room: 'Indoor Sauna' },
    { treatmentId: '9', name: 'Outdoor Sauna Experience', price: 60, duration: 60, category: 'Sauna Experiences', room: 'Outdoor Sauna' },
    { treatmentId: '10', name: 'Relax & Bubble Pool', price: 70, duration: 90, category: 'Sauna Experiences', room: 'Bubble Pool & Relax Area' },
  ],
};


export const createTreatment = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2)); 
    console.log("Full event headers:", event.headers); 

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
    console.log("Authorization token:", token); 

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
      console.log("Decoded JWT:", decoded); 
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

    const { treatmentId, treatmentName, description, price, category, duration, room } = body;

    // Kontrollera att alla nödvändiga fält finns
    if (!treatmentId || !treatmentName || !description || !price || !category || !duration || !room) {
      console.error("Missing required fields:", { treatmentId, treatmentName, description, price, category, duration, room });
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    // Logga värdena på de skickade fälten
    console.log("Treatment data:", { treatmentId, treatmentName, description, price, category, duration, room });

    // Validera att price och duration är siffror
    if (isNaN(price) || isNaN(duration)) {
      console.error("Invalid price or duration", { price, duration });
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Price and duration must be valid numbers' }),
      };
    }

    // Kontrollera att det angivna rummet är giltigt
    if (!validRooms.includes(room)) {
      console.error("Invalid room specified:", room);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid room specified. Valid rooms are: ' + validRooms.join(', ') }),
      };
    }

    // Förbered DynamoDB-parametrar
    const treatmentParams = {
      TableName: 'Treatments',
      Item: {
        treatmentId: { S: treatmentId },
        treatmentName: { S: treatmentName },
        description: { S: description },
        price: { N: price.toString() },
        category: { S: category },
        duration: { N: duration.toString() },
        room: { S: room }, 
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
        treatment: { treatmentId, treatmentName, description, price, category, duration, room },
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
