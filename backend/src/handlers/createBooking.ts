import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../services/db';
import { v4 as uuidv4 } from 'uuid';
import { handleError } from '../services/errorHandler';
import { GetItemCommand, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';

// Funktion för att skapa en ny bokning
export const createBooking = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    let { treatmentId, treatmentName, description, price, duration, category, name, email, phone, date, time, payAtSalon, paymentMethod } = body;

    // Validering av inkommande data
    treatmentId = treatmentId ?? '';
    treatmentName = treatmentName ?? '';
    description = description ?? '';
    price = price ?? 0;
    duration = duration ?? 0;
    category = category ?? '';
    name = name ?? '';
    email = email ?? '';
    phone = phone ?? '';
    date = date ?? '';
    time = time ?? '';
    payAtSalon = payAtSalon ?? false;
    paymentMethod = paymentMethod ?? 'Pay at Salon'; // Default till 'Pay at Salon' om inte annat anges

    // Kontrollera värdet för paymentMethod och logga för felsökning
    console.log("Received paymentMethod: ", paymentMethod);

    if (payAtSalon !== true && payAtSalon !== false) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid payment method' }),
      };
    }

    // Tolkning och validering av tidsformat
    const timeParts = time.split('-');
    if (timeParts.length !== 2) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid time format' }),
      };
    }

    const startTimeStr = `${date}T${timeParts[0]}:00Z`;
    const endTimeStr = `${date}T${timeParts[1].replace('.', ':')}:00Z`;

    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid date or time format' }),
      };
    }

    // Beräkna sluttid inklusive städtid
    const treatmentEndTime = new Date(startTime.getTime() + duration * 60000); // Lägg till behandlingens varaktighet (i ms)
    const cleaningTime = new Date(treatmentEndTime.getTime() + 15 * 60000); // Lägg till 15 min städtid

    // Kontrollera om bokningen redan finns
    const scanParams = {
      TableName: 'Bookings',
      FilterExpression: '#date = :date AND ((#time BETWEEN :startTime AND :endTime) OR (#time BETWEEN :cleanStartTime AND :cleanEndTime))',
      ExpressionAttributeNames: {
        '#date': 'date',
        '#time': 'time',
      },
      ExpressionAttributeValues: {
        ':date': { S: date },
        ':startTime': { S: startTime.toISOString() }, // Starttid för behandling
        ':endTime': { S: treatmentEndTime.toISOString() }, // Sluttid för behandling
        ':cleanStartTime': { S: cleaningTime.toISOString() }, // Starttid för städtid
        ':cleanEndTime': { S: cleaningTime.toISOString() }, // Sluttid för städtid
      },
    };
    const result = await db.send(new ScanCommand(scanParams));

    if (result.Items && result.Items.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'The selected time slot is already taken' }),
      };
    }

    // Skapa bokningen
    const bookingId = uuidv4();
    const bookingStatus = 'Pending';  // Sätt status till Pending vid bokning
    const bookingParams = {
      TableName: 'Bookings',
      Item: {
        bookingId: { S: bookingId },
        treatmentId: { S: treatmentId },
        treatmentName: { S: treatmentName },
        description: { S: description },
        category: { S: category },
        price: { N: price.toString() },
        duration: { N: duration.toString() },
        name: { S: name },
        email: { S: email },
        phone: { S: phone },
        date: { S: date },
        time: { S: time },
        status: { S: bookingStatus },
        paymentMethod: { S: paymentMethod },
        createdAt: { S: new Date().toISOString() },
        endTime: { S: treatmentEndTime.toISOString() }, // Spara sluttiden för bokningen
        cleaningTime: { S: cleaningTime.toISOString() }, // Spara städtiden för bokningen
      },
    };

    await db.send(new PutItemCommand(bookingParams));

    // Skapa betalningen
    const paymentId = uuidv4();
    let paymentStatus = 'Completed'; // Standard status om inte "Pay at Salon"
    if (paymentMethod && paymentMethod.toLowerCase() === 'pay at salon') {
      paymentStatus = 'Pending'; // Om betalmetoden är "Pay at Salon", sätt statusen till Pending
    }

    const paymentParams = {
      TableName: 'PaymentTransactions',
      Item: {
        paymentId: { S: paymentId },
        bookingId: { S: bookingId },
        amount: { N: price.toString() },
        paymentMethod: { S: paymentMethod },
        status: { S: paymentStatus },
        createdAt: { S: new Date().toISOString() },
      },
    };

    await db.send(new PutItemCommand(paymentParams));

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Booking and payment created successfully',
        bookingId,
        paymentId,
        treatmentName,
        price,
        date,
        time,
        customerName: name,
        email,
        phone,
        paymentMethod,
      }),
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return handleError(error, 'Error creating booking');
  }
};
