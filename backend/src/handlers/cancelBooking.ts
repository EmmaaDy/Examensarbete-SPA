import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../services/db';
import { GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

// Funktion för att avboka en behandling
export const cancelBooking = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { bookingId } = body;

    if (!bookingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing bookingId' }),
      };
    }

    const bookingParams = {
      TableName: 'Bookings',
      Key: {
        bookingId: { S: bookingId },
      },
    };

    const result = await db.send(new GetItemCommand(bookingParams));

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Booking not found' }),
      };
    }

    const bookingTime = new Date(result.Item.date.S + ' ' + result.Item.time.S);
    const currentTime = new Date();

    // Beräkna tidsdifferensen mellan bokning och nuvarande tid i timmar
    const timeDifference = (bookingTime.getTime() - currentTime.getTime()) / (1000 * 3600);

    if (timeDifference < 24) {
      // Om avbokningen sker mindre än 24 timmar innan behandlingstid
      await db.send(new UpdateItemCommand({
        TableName: 'Bookings',
        Key: { bookingId: { S: bookingId } },
        UpdateExpression: 'SET #status = :status, #isRefundable = :isRefundable',
        ExpressionAttributeNames: {
          '#status': 'status',
          '#isRefundable': 'isRefundable',
        },
        ExpressionAttributeValues: {
          ':status': { S: 'Cancelled' },
          ':isRefundable': { BOOL: false }, // Ingen återbetalning vid sen avbokning
        },
        ReturnValues: 'ALL_NEW',
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Booking cancelled. Customer is liable for the treatment cost.',
        }),
      };
    } else {
      // Om avbokningen görs mer än 24 timmar innan
      await db.send(new UpdateItemCommand({
        TableName: 'Bookings',
        Key: { bookingId: { S: bookingId } },
        UpdateExpression: 'SET #status = :status, #isRefundable = :isRefundable',
        ExpressionAttributeNames: {
          '#status': 'status',
          '#isRefundable': 'isRefundable',
        },
        ExpressionAttributeValues: {
          ':status': { S: 'Cancelled' },
          ':isRefundable': { BOOL: true }, // Återbetalning tillåten
        },
        ReturnValues: 'ALL_NEW',
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Booking cancelled successfully. Refund allowed.',
        }),
      };
    }
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
