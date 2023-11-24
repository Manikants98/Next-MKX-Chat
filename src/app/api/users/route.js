import dbConnect from "@/lib/db";
import { User } from "@/lib/model/users";
import bcrypt from "bcrypt";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const headers = await req?.headers;
    const token = await headers?.get("authorization");
    if (token) {
      await dbConnect();
      const user = await User.findOne({ token });
      if (user) {
        return NextResponse.json(
          { message: "Users get successfully", user: { ...user._doc } },
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const payload = await req.json();

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

    const token = jwt.sign({ email, role }, JWT_SECRET);

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

export async function PUT(req) {
  try {
    const headers = await req?.headers;
    const token = await headers?.get("authorization");
    if (!token) {
      return NextResponse.json(
        { message: "Need Authorization Token" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid Authorization Token" },
        { status: 400 }
      );
    }
    const payload = await req.json();
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
