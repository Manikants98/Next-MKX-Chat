import dbConnect from "@/lib/db";
import { User } from "@/lib/model/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  await dbConnect();
  try {
    const users = await User.find();
    return NextResponse.json(
      { message: "Users get successfully", users },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Oops, some unspected error occured..!" },
      { status: 500 }
    );
  }
}
const saltRounds = 10;

export async function POST(req, res) {
  const payload = await req.json();
  const { name, email, password, mobile_number, dob, gender } = payload;
  await dbConnect();

  try {
    if (!name) {
      return NextResponse.json(
        { message: "Please enter your name" },
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
        { message: "This email is already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      mobile_number: mobile_number ? mobile_number : "",
      dob: dob ? dob : new Date(),
      gender: gender ? gender : "",
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
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
