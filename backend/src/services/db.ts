import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

// Skapa DynamoDB-klient
const client = new DynamoDB({
  region: process.env.AWS_REGION,  // Eller hårdkoda om du vill ha en specifik region
});

const db = DynamoDBDocument.from(client);

// Exportera db för att användas i andra delar av applikationen
export { db };
