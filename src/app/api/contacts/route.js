import dbConnect from "@/lib/db";
import { Contact } from "@/lib/model/contacts";
import { User } from "@/lib/model/users";
import { NextResponse } from "next/server";
import { TokenFetcher, isValidAuthorization } from "../helper";

export async function GET(request) {
  try {
    const token = await TokenFetcher(request);
    if (token) {
      await dbConnect();
      const user = await User.findOne({ token });
      if (!user) {
        return NextResponse.json(
          { message: "Provide a valid authorization token" },
          { status: 200 }
        );
      }
      const contacts = await Contact.find({ user_id: user?._id });
      return NextResponse.json(
        { message: "Contacts get successfully", contacts },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "You need to login first" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const {
    avatar,
    first_name,
    last_name,
    email,
    mobile_number,
    instagram = "https://instagram.com/",
    linkedin = "https://linkedin.com/",
    contact_type = "General",
  } = await request.json();

  try {
    await dbConnect();

    if (!first_name || !email) {
      return NextResponse.json(
        { message: "First name and email are required." },
        { status: 400 }
      );
    }

    if (mobile_number && mobile_number.length !== 10) {
      return NextResponse.json(
        { message: "Mobile number must be a 10-digit numeric value." },
        { status: 400 }
      );
    }

    const token = await TokenFetcher(request);

    if (!token) {
      return NextResponse.json(
        { message: "You need to log in first." },
        { status: 401 }
      );
    }

    const user = await User.findOne({ token });

    if (!user) {
      return NextResponse.json(
        { message: "Provide a valid authorization token." },
        { status: 401 }
      );
    }

    const existingContact = await Contact.findOne({ email, user_id: user._id });

    if (existingContact) {
      return NextResponse.json(
        { message: "This email already exists." },
        { status: 400 }
      );
    }

    const newContact = new Contact({
      avatar,
      first_name,
      last_name,
      email,
      mobile_number,
      instagram,
      linkedin,
      contact_type,
      user_id: user._id,
    });

    await newContact.save();
    return NextResponse.json({ message: "Contact created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const {
    avatar,
    first_name,
    last_name,
    email,
    mobile_number,
    instagram,
    linkedin,
    contact_type,
  } = await request.json();

  try {
    await dbConnect();

    if (!first_name || !email) {
      return NextResponse.json(
        { message: "First name and email are required." },
        { status: 400 }
      );
    }

    if (mobile_number && mobile_number.length !== 10) {
      return NextResponse.json(
        { message: "Mobile number must be a 10-digit numeric value." },
        { status: 400 }
      );
    }

    const token = await TokenFetcher(request);

    if (!token) {
      return NextResponse.json(
        { message: "You need to log in first." },
        { status: 401 }
      );
    }

    const user = await User.findOne({ token });

    if (!user) {
      return NextResponse.json(
        { message: "Provide a valid authorization token." },
        { status: 401 }
      );
    }

    const existingContact = await Contact.findOne({ email, user_id: user._id });

    if (!existingContact) {
      return NextResponse.json(
        { message: "Contact not found for the provided email." },
        { status: 404 }
      );
    }

    await Contact.findByIdAndUpdate(existingContact._id, {
      avatar,
      first_name,
      last_name,
      email,
      mobile_number,
      instagram,
      linkedin,
      contact_type,
    });

    return NextResponse.json({ message: "Contact updated." }, { status: 200 });
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
        { message: "Please provide a contact ID." },
        { status: 400 }
      );
    }
    const token = await TokenFetcher(request);

    if (!token) {
      return NextResponse.json(
        { message: "You need to log in first." },
        { status: 401 }
      );
    }
    const existingContact = await Contact.findOne({ email, user_id: user._id });

    if (!existingContact) {
      return NextResponse.json(
        { message: "Contact not found for the provided email." },
        { status: 404 }
      );
    }
    await Contact.findByIdAndDelete(_id);
    return NextResponse.json({ message: "Contact deleted." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
