import { db } from "../../services/db";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import dotenv from "dotenv";

// Ladda miljövariabler från .env-filen
dotenv.config();

export const adminLoginOrCreate = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { adminID, adminPassword, isCreateAdmin } = JSON.parse(event.body || "{}");

    console.log("Received admin ID:", adminID);
    console.log("Received admin password:", adminPassword);

    // Kontrollera att adminID och adminPassword finns i begäran
    if (!adminID || !adminPassword) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Admin ID and password are required" }),
      };
    }

    if (isCreateAdmin) {
      // Skapa ny admin
      const getCommand = new GetCommand({
        TableName: "AdminUsers",
        Key: { username: adminID },
      });

      const existingAdmin = await db.send(getCommand);

      if (existingAdmin.Item) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({ error: "Admin with this ID already exists" }),
        };
      }

      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const putCommand = new PutCommand({
        TableName: "AdminUsers",
        Item: {
          username: adminID,
          hashedPassword,
          role: "admin",
        },
      });

      try {
        await db.send(putCommand);
      } catch (error) {
        console.error("Error saving new admin to database:", error);
        return {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({ error: "Failed to create admin" }),
        };
      }

      console.log("Admin created:", adminID);
      return {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ message: "Admin created successfully" }),
      };
    } else {
      // Logga in som admin
      const getCommand = new GetCommand({
        TableName: "AdminUsers",
        Key: { username: adminID },
      });

      const adminCredentials = await db.send(getCommand);

      if (!adminCredentials.Item) {
        return {
          statusCode: 401,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({ error: "Invalid credentials" }),
        };
      }

      const hashedPassword = adminCredentials.Item.hashedPassword;

      const isPasswordValid = await bcrypt.compare(adminPassword, hashedPassword);

      if (!isPasswordValid) {
        return {
          statusCode: 401,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({ error: "Invalid credentials" }),
        };
      }

      // Kontrollera om JWT_SECRET_KEY är definierad i miljövariabler
      const secret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
      console.log("JWT_SECRET:", secret); // Lägg till logg för att validera att JWT_SECRET finns
      if (!secret) {
        console.error("JWT_SECRET is not defined");
        return {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({ error: "JWT secret is not configured" }),
        };
      }

      // Generera JWT-token
      let token;
      try {
        token = jwt.sign(
          { adminID, role: "admin", iat: Math.floor(Date.now() / 1000) },
          secret,
          { expiresIn: "2h" }
        );
        console.log("JWT token generated:", token);
      } catch (error) {
        console.error("Error generating JWT:", error);
        return {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({ error: "Error generating JWT token" }),
        };
      }

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({
          message: "Admin login successful!",
          token,
        }),
      };
    }
  } catch (error: any) {
    console.error("Error during admin process:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: "Internal Server Error", message: error.message }),
    };
  }
};
