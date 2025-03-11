import { APIGatewayProxyResult } from 'aws-lambda';

// Funktion för att hantera fel och returnera standardiserade felmeddelanden
export const handleError = (error: any, customMessage: string): APIGatewayProxyResult => {
  console.error(customMessage, error); // Logga felet för felsökning
  return {
    statusCode: 500,
    body: JSON.stringify({ message: customMessage, error: error.message }),
  };
};
