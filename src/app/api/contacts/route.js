import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contacts = await sql`
      SELECT * FROM contacts
    `;
    return NextResponse.json({ data: contacts }, { status: 200 });
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
  const payload = await req.json();

  if (!payload.first_name) {
    return NextResponse.json(
      { message: "First name is required", data: null },
      { status: 400 }
    );
  }

  if (!payload.mobile_number) {
    return NextResponse.json(
      { message: "Mobile number is required", data: null },
      { status: 400 }
    );
  }
  if (payload.mobile_number.length !== 10 || isNaN(payload.mobile_number)) {
    return NextResponse.json(
      { message: "Mobile number must be a 10-digit numeric value", data: null },
      { status: 400 }
    );
  }

  try {
    const newContact = await sql`
        INSERT INTO contacts (first_name, last_name, mobile_number, email, label)
        VALUES (${payload.first_name}, ${payload.last_name}, ${payload.mobile_number}, ${payload.email}, ${payload.label})
        RETURNING *;
      `;
    return NextResponse.json({ data: newContact }, { status: 201 });
  } catch (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { message: "Mobile number already exists", data: null },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          message:
            "Oops! An unexpected error occurred. Please try again later.",
        },
        { status: 500 }
      );
    }
  }
}

export async function PUT(req) {
  const payload = await req.json();

  try {
    const updatedContact = await sql`
      UPDATE contacts
      SET first_name = ${payload.first_name}, last_name = ${payload.last_name},
          mobile_number = ${payload.mobile_number}, email = ${payload.email},
          label = ${payload.label}
      WHERE id = ${payload.id}
      RETURNING *;
    `;
    return NextResponse.json({ data: updatedContact }, { status: 200 });
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
  const payload = await req.json();

  try {
    await sql`
      DELETE FROM contacts
      WHERE id = ${payload.id};
    `;
    return NextResponse.json(
      { message: "Contact deleted successfully" },
      { status: 200 }
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
