import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../services/db';  
import { handleError } from '../services/errorHandler';  
import { ScanCommand } from '@aws-sdk/client-dynamodb';  

// Funktion för att formatera items från DynamoDB
const formatTreatment = (item: any) => ({
  treatmentId: item.treatmentId.S,          // Behandlingens ID
  treatmentName: item.treatmentName.S,      // Behandlingens namn, ändrat från 'name' till 'treatmentName'
  description: item.description.S,          // Beskrivning
  price: parseInt(item.price.N, 10),        // Pris (parsa som heltal)
  duration: parseInt(item.duration.N, 10),  // Varaktighet (parsa som heltal)
  category: item.category.S,                // Kategori
});

// Funktion för att hämta behandlingar från DynamoDB med möjlighet att filtrera på kategori
export const getTreatments = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Hämta kategori från queryparams (om det finns)
    const category = event.queryStringParameters?.category;

    let params: any = {
      TableName: 'Treatments',  // Tabellnamnet i DynamoDB
    };

    // Om kategori är angiven, använd ScanCommand för att filtrera på kategori
    if (category) {
      console.log("Filtering by category:", category);  
      params.FilterExpression = 'category = :category';
      params.ExpressionAttributeValues = {
        ':category': { S: category },
      };
    }

    // Använd ScanCommand för att hämta alla behandlingar eller filtrera på kategori
    const result = await db.send(new ScanCommand(params));

    // Kontrollera vad som returneras från DynamoDB
    console.log("Fetched result from DynamoDB:", result.Items);  

    // Kolla om result.Items finns innan vi försöker mappa över den
    const formattedItems = result.Items ? result.Items.map(formatTreatment) : [];

    // Returnera det formaterade svaret som JSON
    return {
      statusCode: 200,
      body: JSON.stringify(formattedItems),
    };
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return handleError(error, 'Error fetching treatments');
  }
};
