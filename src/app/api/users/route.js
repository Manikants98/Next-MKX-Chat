import dbConnect from "@/lib/db";
import { User } from "@/lib/model/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { isNotLoginMessage, isTokenNotValidMessage, useToken } from "../helper";

export async function GET(request) {
  try {
    const token = await useToken(request);
    if (!token) {
      return NextResponse.json({ message: isNotLoginMessage }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json(
        { message: isTokenNotValidMessage },
        { status: 401 }
      );
    }
    const { role } = jwt.decode(token, process.env.JWT_SECRET_KEY);
    if (role !== "Admin") {
      return NextResponse.json(
        { message: "User get successfully", user: { ...user._doc } },
        { status: 200 }
      );
    }
    const users = await User.find();
    if (role === "Admin") {
      return NextResponse.json(
        { message: "Users get successfully", users, user },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const payload = await request.json();
  const {
    first_name,
    last_name,
    email,
    password,
    mobile_number,
    role,
    dob,
    gender,
    business_category_id,
    business_subcategory_id,
    country_id,
    state_id,
    city_id,
    area,
    pincode,
    instagram,
    linkedin,
  } = payload;

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
    await dbConnect();
    const users = await User.find({ email: email });
    if (users?.length >= 1) {
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
      mobile_number,
      dob,
      gender,
      token,
      role,
      business_category_id,
      business_subcategory_id,
      country_id,
      state_id,
      city_id,
      area,
      pincode,
      instagram,
      linkedin,
      password: await bcrypt.hash(password, 10),
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
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = await useToken(request);
    if (!token) {
      return NextResponse.json({ message: isNotLoginMessage }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json(
        { message: isTokenNotValidMessage },
        { status: 401 }
      );
    }
    const payload = await request.json();
    const { email, password, ...updateFields } = payload;
    if (email || password) {
      return NextResponse.json(
        { message: "Can't update these keys, email, passowrd, token." },
        { status: 400 }
      );
    }
    await User.findByIdAndUpdate(user._id, updateFields, { new: true });
    return NextResponse.json(
      { message: "Updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { _id } = await request.json();
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
