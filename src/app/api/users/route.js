import dbConnect from "@/lib/db";
import { User } from "@/lib/model/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  await dbConnect();
  try {
    const users = await User.find().sort({ created_date: -1 });
    return NextResponse.json(
      { message: "Users fetched successfully", users },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Oops, some unexpected error occurred..!" },
      { status: 500 }
    );
  }
}

const saltRounds = 10;

export async function POST(req, res) {
  const payload = await req.json();
  const { profile_picture, name, email, password, mobile_number, dob, gender } =
    payload;
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
    const users = await User.findOne({ email: email });

    if (users) {
      return NextResponse.json(
        { message: "This email is already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      profile_picture,
      name: name,
      email: email,
      password: hashedPassword,
      mobile_number: mobile_number ? mobile_number : "",
      dob: dob ? dob : new Date(),
      gender: gender,
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
    return NextResponse.json(
      {
        message: "Oops! An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
export async function PUT(req, res) {
  try {
    const payload = await req.json();
    const { _id, name, mobile_number, dob, gender } = payload;

    if (!_id) {
      return NextResponse.json(
        { message: "Please provide a User ID." },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json(
        { message: "Please enter your name" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedUser = {
      name: name || undefined,
      mobile_number: mobile_number || undefined,
      dob: dob || undefined,
      gender: gender || undefined,
    };

    await User.findByIdAndUpdate(_id, updatedUser, { new: true });

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Oops! An unexpected error occurred. Please try again later.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { _id } = await req.json();
  await dbConnect();
  try {
    if (!_id) {
      return NextResponse.json(
        { message: "Please provide a User ID." },
        { status: 400 }
      );
    }
    const user = await User.findOne({ _id });

    if (!user) {
      return NextResponse.json(
        {
          message: "This user is not exist.",
        },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(_id);

    return NextResponse.json({ message: "User deleted." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Oops! An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
