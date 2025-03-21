import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from '../../services/db';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const timeSlots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {  
    for (let minute = 0; minute < 60; minute += 15) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  return timeSlots;
};

export const getSchedule = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const token = event.headers['Authorization']?.split(' ')[1] || event.headers['authorization']?.split(' ')[1];
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Authorization token is required' }),
      };
    }

    let decoded: { username: string; role: string; employee?: string };
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { username: string; role: string; employee?: string };
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid or expired token' }),
      };
    }

    const { employee } = decoded;

    const scanCommand = new ScanCommand({ TableName: 'Bookings' });
    const result = await db.send(scanCommand);

    const timeSlots = generateTimeSlots(9, 18);  

    let schedule = timeSlots.map(time => {
      let isAvailable = true;

      if (time >= '12:00' && time < '13:00') {
        isAvailable = false;
      }

      return {
        time,
        isAvailable,
        employee: employee,
      };
    });

    if (result.Items) {
      const bookings = result.Items.filter(item => item.employee.S === employee);

      bookings.forEach(booking => {
        const bookingTime = booking.time.S;
        const index = schedule.findIndex(slot => slot.time === bookingTime);
        if (index !== -1) {
          schedule[index].isAvailable = false;
        }
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        schedule,
      }),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching schedule', error: error.message }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching schedule', error: 'Unknown error' }),
    };
  }
};
