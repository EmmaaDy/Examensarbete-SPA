import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const getEmployees: APIGatewayProxyHandler = async (event) => {
  const tableName = "Employees";  
  const params = { TableName: tableName };

  try {
    const result = await dynamoDb.scan(params).promise();

    if (!result.Items || result.Items.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ message: 'No employees found' }) };
    }

    const employees = result.Items.map((item) => {
      const workHours = { start: '09:00', end: '18:00' };
      const lunchBreak = { start: '12:00', end: '13:00' };
      return { name: item.name, treatments: item.treatments || [], workHours, lunchBreak };
    });

    return { statusCode: 200, body: JSON.stringify(employees) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error fetching employees' }) };
  }
};
