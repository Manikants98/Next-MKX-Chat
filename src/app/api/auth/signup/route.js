import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function POST(req) {
  const payload = await req.json();

  try {
    const JWT_SECRET = crypto.randomBytes(64).toString("hex");
    const newUserId = uuidv4();
    const [existingUser] = await sql`
      SELECT id
      FROM users
      WHERE email = ${payload.email}
    `;

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use", data: null },
        { status: 400 }
      );
    }

    const userData = {
      id: newUserId,
      username: payload.username,
      email: payload.email,
      mobile_number: payload.mobile_number,
    };
    const token = jwt.sign({ userId: userData.id }, JWT_SECRET);
    const insertResult = await sql`
      INSERT INTO users (id, username, email, token, role, mobile_number)
      VALUES (${userData.id}, ${userData.username}, ${userData.email}, ${token}, 'User', ${userData.mobile_number})
      RETURNING id;
    `;

    if (!insertResult.length) {
      return NextResponse.json(
        { error: "Failed to create a new user", data: null },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Sign Up Successfully",
      token: token,
      status: 200,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
