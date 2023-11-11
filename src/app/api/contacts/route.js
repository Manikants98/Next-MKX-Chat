import dbConnect from "@/lib/db";
import { Contact } from "@/lib/model/contacts";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const contacts = await Contact.find();
    return NextResponse.json(
      { message: "Contacts get successfully", contacts },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Oops! An unexpected error occurred. Please try again later.",
      },
      { status: 400 }
    );
  }
}

export async function POST(req) {
  const { profile_picture, first_name, last_name, email, mobile_number } =
    await req.json();
  await dbConnect();
  try {
    if (!first_name) {
      return NextResponse.json(
        { message: "First name is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }
    if (mobile_number) {
      if (mobile_number.length !== 10) {
        return NextResponse.json(
          {
            message: "Mobile number must be a 10-digit numeric value",
          },
          { status: 400 }
        );
      }
    }

    const contact = await Contact.find({ email });
    if (contact) {
      return NextResponse.json(
        {
          message: "This email is already exist.",
        },
        { status: 400 }
      );
    }

    const newContact = await Contact({
      profile_picture,
      first_name,
      last_name,
      email,
      mobile_number,
    });

    await newContact.save();
    return NextResponse.json(
      { message: "Contact created.", data: newContact },
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
export async function PUT(req) {
  const { _id, profile_picture, first_name, last_name, email, mobile_number } =
    await req.json();
  await dbConnect();
  try {
    if (!_id) {
      return NextResponse.json(
        { message: "Please provide a contact ID." },
        { status: 400 }
      );
    }
    if (!first_name) {
      return NextResponse.json(
        { message: "First name is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }
    if (mobile_number) {
      if (mobile_number.length !== 10) {
        return NextResponse.json(
          {
            message: "Mobile number must be a 10-digit numeric value",
          },
          { status: 400 }
        );
      }
    }

    const contact = await Contact.find({ email });
    if (contact) {
      NextResponse.json(
        {
          message: "This email is already exist.",
        },
        { status: 400 }
      );
    }

    const newContact = await Contact.findByIdAndUpdate(_id, {
      profile_picture,
      first_name,
      last_name,
      email,
      mobile_number,
    });
    const validationError = newContact.validateSync();

    if (validationError) {
      return NextResponse.json(
        { error: validationError.errors },
        { status: 400 }
      );
    }
    await newContact.save();
    return NextResponse.json(
      { message: "Contact updated.", data: newContact },
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

export async function DELETE(req) {
  const { _id } = await req.json();
  await dbConnect();
  try {
    if (!_id) {
      return NextResponse.json(
        { message: "Please provide a contact ID." },
        { status: 400 }
      );
    }
    const contact = await Contact.find({ _id });

    if (contact.length === 0) {
      return NextResponse.json(
        {
          message: "This contact is not exist.",
        },
        { status: 400 }
      );
    }

    await Contact.findByIdAndDelete(_id);

    return NextResponse.json({ message: "Contact deleted." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Oops! An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
