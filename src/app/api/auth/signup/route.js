import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@/lib/model/users";

export async function POST(req) {
  const payload = await req.json();
  const { first_name, last_name, email, password, role = "User" } = payload;
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
    const users = await User.findOne({ email: email });

    if (users) {
      return NextResponse.json(
        { message: "This email already exists." },
        { status: 400 }
      );
    }
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET_KEY);

    const user = new User({
      first_name,
      last_name,
      email,
      token,
      password: await bcrypt.hash(password, 10),
    });
    await user.save();
    return NextResponse.json(
      { message: "User registered successfully", token: token },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
