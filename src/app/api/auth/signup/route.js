import dbConnect from "@/lib/db";
import { User } from "@/lib/model/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
export async function GET(req) {
  try {
    const headers = await req?.headers;
    const token = await headers?.get("authorization");
    if (token) {
      await dbConnect();
      const user = await User.findOne({ token });
      if (user) {
        return NextResponse.json(
          { message: "Users get successfully", user: user._doc },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Invalid Authorization Token" },
          { status: 200 }
        );
      }
    } else {
      const users = await User.find();
      return NextResponse.json(
        { message: "Users get successfully", users },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Oops, some unexpected error occurred..!" },
      { status: 500 }
    );
  }
}

const JWT_SECRET = crypto.randomBytes(64).toString("hex");

const saltRounds = 10;

export async function POST(req) {
  const payload = await req.json();

  const { first_name, last_name, email, password, mobile_number, dob, gender } =
    payload;
  await dbConnect();
  try {
    if (!first_name) {
      return NextResponse.json(
        { message: "Please enter your first name" },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json(
        { message: "Please enter your email" },
        { status: 400 }
      );
    }
    if (!password) {
      return NextResponse.json(
        { message: "Please enter your password" },
        { status: 400 }
      );
    }
    const users = await User.find({ email: email });

    if (users?.length >= 1) {
      return NextResponse.json(
        { message: "This email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const token = jwt.sign({ email: email }, JWT_SECRET);

    const user = new User({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword,
      mobile_number: mobile_number,
      dob: dob ? dob : new Date("2000-01-01"),
      gender: gender,
      token: token,
    });

    const validationError = user.validateSync();

    if (validationError) {
      return NextResponse.json(
        { error: validationError.errors },
        { status: 400 }
      );
    }

    await user.save();
    return NextResponse.json(
      { message: "User registered successfully", token: token },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
