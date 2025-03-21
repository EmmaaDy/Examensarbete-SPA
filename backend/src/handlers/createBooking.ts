import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../services/db';
import { v4 as uuidv4 } from 'uuid';
import { handleError } from '../services/errorHandler';
import { PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';

const employeesTreatments = {
  Victoria: [
    { "treatmentId": "4", "name": "Hydrating Facial", "price": 70, "duration": 45, "category": "Face Care Treatment", "room": "Face Care Treatment" },
    { "treatmentId": "5", "name": "Anti-Aging Facial", "price": 90, "duration": 60, "category": "Face Care Treatment", "room": "Face Care Treatment" }
  ],
  Emma: [
    { "treatmentId": "1", "name": "Relaxing Spa Massage", "price": 75, "duration": 60, "category": "Massage Treatments", "room": "Massage Room" },
    { "treatmentId": "2", "name": "Himalayan Salt Massage", "price": 85, "duration": 60, "category": "Massage Treatments", "room": "Massage Room" },
    { "treatmentId": "3", "name": "Deep Tissue Massage", "price": 80, "duration": 60, "category": "Massage Treatments", "room": "Massage Room" }
  ],
  Isabella: [
    { "treatmentId": "6", "name": "Body Scrub & Hydration", "price": 85, "duration": 60, "category": "Body Care Treatments", "room": "Body Care Treatments" },
    { "treatmentId": "7", "name": "Aromatherapy Wrap", "price": 80, "duration": 45, "category": "Body Care Treatments", "room": "Body Care Treatments" }
  ],
  Olivia: [
    { "treatmentId": "8", "name": "Indoor Sauna Session", "price": 50, "duration": 60, "category": "Sauna Experiences", "room": "Indoor Sauna" },
    { "treatmentId": "9", "name": "Outdoor Sauna Experience", "price": 60, "duration": 60, "category": "Sauna Experiences", "room": "Outdoor Sauna" },
    { "treatmentId": "10", "name": "Relax & Bubble Pool", "price": 70, "duration": 90, "category": "Sauna Experiences", "room": "Bubble Pool & Relax Area" }
  ]
};

type TreatmentCategory = 'Face Care Treatment' | 'Massage Treatments' | 'Body Care Treatments' | 'Sauna Experiences';

const maxPeoplePerCategory: Record<TreatmentCategory, number> = {
  "Face Care Treatment": 1,
  "Massage Treatments": 2,
  "Body Care Treatments": 1,
  "Sauna Experiences": 10
};

export const createBooking = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const {
      treatmentId = '',
      treatmentName = '',
      description = '',
      price = 0,
      duration = 0,
      category = '',
      name = '',
      email = '',
      phone = '',
      date = '',
      time = '',
      payAtSalon = false,
      paymentMethod = 'Pay at Salon',
      room = '',
      comment = '', 
      numberOfPeople = 1, 
    } = body;

    // Type cast category to TreatmentCategory
    const categoryTyped = category as TreatmentCategory;

    // Check the max allowed number of people for the given category
    const maxPeople = maxPeoplePerCategory[categoryTyped];
    if (numberOfPeople > maxPeople) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `The maximum number of people for this category (${category}) is ${maxPeople}.` }),
      };
    }

    let employee: string | null = null;
    let treatmentRoom: string | null = null;

    // Find the correct employee and treatment
    for (const [emp, treatments] of Object.entries(employeesTreatments)) {
      const treatment = treatments.find(t => t.treatmentId === treatmentId);
      if (treatment && treatment.category === category) {
        employee = emp;
        treatmentRoom = treatment.room;
        break;
      }
    }

    if (!employee || !treatmentRoom) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid treatment ID or treatment not found for any employee.' }),
      };
    }

    // Validate room
    if (room !== treatmentRoom) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `The treatment requires the room: ${treatmentRoom}, but you selected: ${room}` }),
      };
    }

    // Validate date and time
    const localStartTime = new Date(`${date}T${time}`);
    if (isNaN(localStartTime.getTime())) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid date or time format.' }),
      };
    }
    const utcStartTime = new Date(localStartTime.getTime() - localStartTime.getTimezoneOffset() * 60000);

    const currentTime = new Date();
    if (utcStartTime <= currentTime) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'You cannot book a time in the past.' }),
      };
    }

    // Lunch break check
    const lunchStartTime = new Date(`${date}T12:00:00`);
    const lunchEndTime = new Date(`${date}T13:00:00`);
    if (localStartTime >= lunchStartTime && localStartTime < lunchEndTime) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'The selected time slot is within the lunch break (12:00 - 13:00). Please select a different time.' }),
      };
    }

    // Calculate the end time of the treatment
    const treatmentEndTime = new Date(localStartTime.getTime() + duration * 60000);
    const cleaningTime = new Date(treatmentEndTime.getTime() + 15 * 60000);

    // Define the salon's closing time (17:45)
    const closingTime = new Date(`${date}T17:45:00`);

    // Check that the treatment does not end after closing time
    if (treatmentEndTime > closingTime) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'The treatment cannot end later than the closing time of 17:45.' }),
      };
    }

    // Check for overlapping bookings
    const scanParams = {
      TableName: 'Bookings',
      FilterExpression: '#date = :date AND #room = :room AND ((' +
        ':startTime BETWEEN #startTime AND #endTime) OR ' +
        '(:endTime BETWEEN #startTime AND #endTime))',
      ExpressionAttributeNames: {
        '#date': 'date',
        '#room': 'room',
        '#startTime': 'time',
        '#endTime': 'endTime',
      },
      ExpressionAttributeValues: {
        ':date': { S: date },
        ':room': { S: room },
        ':startTime': { S: localStartTime.toISOString() },
        ':endTime': { S: treatmentEndTime.toISOString() },
      },
    };

    // Perform scan to check for overlaps
    const result = await db.send(new ScanCommand(scanParams));

    if (result.Items && result.Items.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'The selected time slot for this treatment is already taken or overlaps with another booking.' }),
      };
    }

    // Adjust price based on the number of people
    const additionalPricePerPerson = 10; 
    const totalPrice = price + (numberOfPeople - 1) * additionalPricePerPerson;

    // Create the booking
    const bookingId = uuidv4();
    const bookingStatus = 'Pending';

    // Format time
    const localTimeFormatted = `${localStartTime.getHours().toString().padStart(2, '0')}:${localStartTime.getMinutes().toString().padStart(2, '0')}`;

    const bookingParams = {
      TableName: 'Bookings',
      Item: {
        bookingId: { S: bookingId },
        treatmentId: { S: treatmentId },
        treatmentName: { S: treatmentName },
        description: { S: description },
        category: { S: category },
        price: { N: totalPrice.toString() },
        duration: { N: duration.toString() },
        name: { S: name },
        email: { S: email },
        phone: { S: phone },
        date: { S: date },
        time: { S: localTimeFormatted },
        status: { S: bookingStatus },
        paymentMethod: { S: paymentMethod },
        createdAt: { S: new Date().toISOString() },
        endTime: { S: treatmentEndTime.toISOString() },
        cleaningTime: { S: cleaningTime.toISOString() },
        employee: { S: employee },
        room: { S: room },
        comment: { S: comment },
        numberOfPeople: { N: numberOfPeople.toString() },
      },
    };

    await db.send(new PutItemCommand(bookingParams));

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Booking created successfully.',
        bookingId,
        treatmentName,
        price: totalPrice,
        date,
        time: localTimeFormatted,
        customerName: name,
        email,
        phone,
        paymentMethod,
        employee,
        room,
        comment,
        numberOfPeople,
      }),
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return handleError(error, 'Error creating booking');
  }
};
