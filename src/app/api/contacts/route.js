import dbConnect from "@/lib/db";
import { Contact } from "@/lib/model/contacts";
import { User } from "@/lib/model/users";
import { NextResponse } from "next/server";
import {
  isNotLoginMessage,
  isTokenNotValidMessage,
  useSearchParams,
  useToken,
} from "../helper";

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
        { status: 200 }
      );
    }
    const query = await useSearchParams(request);
    const _id = query.get("_id");
    const contact = await Contact.findOne({ _id, user_id: user._id });
    if (_id) {
      if (!contact) {
        return NextResponse.json(
          { message: "Oops..? Contact not found" },
          { status: 404 }
        );
      } else {
        return NextResponse.json({ contact }, { status: 200 });
      }
    } else {
      const contacts = await Contact.find({ user_id: user._id }).sort({
        is_chat_active: -1,
      });

      return NextResponse.json(
        { message: "Contacts retrieved successfully", contacts },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred", details: error.message },
      { status: 500 }
    );
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

    const token = await useToken(request);

    if (!token) {
      return NextResponse.json(
        { message: "You need to log in first." },
        { status: 401 }
      );
    }
    await dbConnect();

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
    const users = await User.findOne({ email });
    const is_chat_active = Boolean(users);

    const newContact = new Contact({
      avatar,
      first_name,
      last_name,
      email,
      mobile_number,
      instagram,
      linkedin,
      contact_type,
      is_chat_active,
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

    const token = await useToken(request);

    if (!token) {
      return NextResponse.json(
        { message: "You need to log in first." },
        { status: 401 }
      );
    }
    await dbConnect();

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
  try {
    if (!_id) {
      return NextResponse.json(
        { message: "Please provide a contact ID." },
        { status: 400 }
      );
    }
    const token = await useToken(request);

    if (!token) {
      return NextResponse.json(
        { message: "You need to log in first." },
        { status: 401 }
      );
    }
    await dbConnect();
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
