import dbConnect from "@/lib/db";
import { User } from "@/lib/model/users";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();
  try {
    if (!email) {
      return NextResponse.json(
        { message: "Oops! You forget to enter email." },
        { status: 400 }
      );
    }
    if (!password) {
      return NextResponse.json(
        { message: "Oops! You forget to enter password." },
        { status: 400 }
      );
    }
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Oops! You have enterd incorrect email." },
        { status: 401 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Oops! You have enterd incorrect password." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: "Login successful", token: user.token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Login failed. Please try again later" },
      { status: 500 }
    );
  }
}
