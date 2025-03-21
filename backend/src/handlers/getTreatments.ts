import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../services/db';
import { handleError } from '../services/errorHandler';
import { ScanCommand } from '@aws-sdk/client-dynamodb';

// Function to format treatments with associated employee details
const formatTreatment = (item: any) => {
  return {
    treatmentId: item.treatmentId.S,
    treatmentName: item.treatmentName.S,
    description: item.description.S,
    price: parseInt(item.price.N, 10),
    duration: parseInt(item.duration.N, 10),
    category: item.category.S,
    room: item.room?.S || "Unknown Room",
    employee: item.employee?.M
      ? {
          employeeId: item.employee.M.employeeId.S,
          name: item.employee.M.name.S,
        }
      : {
          employeeId: "Unknown",
          name: "Unknown Employee",
        },
  };
};


// Fetch treatments and employees and format them
export const getTreatments = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const category = event.queryStringParameters?.category;

    let params: any = {
      TableName: 'Treatments',
    };

    if (category) {
      console.log("Filtering by category:", category);
      params.FilterExpression = 'category = :category';
      params.ExpressionAttributeValues = {
        ':category': { S: category },
      };
    }

    const treatmentResult = await db.send(new ScanCommand(params));

    console.log("Fetched result from DynamoDB:", treatmentResult.Items);

    if (!treatmentResult.Items || treatmentResult.Items.length === 0) {
      throw new Error("No treatments found.");
    }

    // Process the treatments
    const formattedItems = treatmentResult.Items.map((item: any) => formatTreatment(item));

    return {
      statusCode: 200,
      body: JSON.stringify(formattedItems),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching treatments:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching treatments', error: error.message }),
      };
    } else {
      console.error('An unknown error occurred:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'An unknown error occurred' }),
      };
    }
  }
};
