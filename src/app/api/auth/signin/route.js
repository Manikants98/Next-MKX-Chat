import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function POST(req) {
  const payload = await req.json();
  const JWT_SECRET = crypto.randomBytes(64).toString("hex");

  const existingUser = await sql`
    SELECT id
    FROM users
    WHERE email = ${payload.email}
  `;

  if (existingUser.length > 0) {
    return NextResponse.json(
      { error: "Email already in use", data: null },
      { status: 400 }
    );
  }
  const newUserId = uuidv4();

  const userData = {
    id: newUserId,
    username: payload.username,
    email: payload.email,
    password: payload.password,
    mobile_number: payload.mobile_number,
  };
  const token = jwt.sign({ userId: userData.id }, JWT_SECRET);
  const insertResult = await sql`
    INSERT INTO users (id, username, email, password, token, role, mobile_number)
    VALUES (${userData.id}, ${userData.username}, ${userData.email},  ${userData.password}, ${token}, 'User', ${userData.mobile_number})
    RETURNING id;
  `;
  if (insertResult.length === 0) {
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
}
