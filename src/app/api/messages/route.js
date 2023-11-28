import dbConnect from "@/lib/db";
import { Chats } from "@/lib/model/chats";
import { Messages } from "@/lib/model/messages";
import { User } from "@/lib/model/users";
import { NextResponse } from "next/server";
import { TokenFetcher } from "../helper";

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
      const queryParams = request.nextUrl.searchParams;
      const chat_id = queryParams.get("chat_id");

      const chat = await Chats.findOne({ user_id: user?._id, _id: chat_id });
      const messages = await Messages.find({ chat_id });

      return NextResponse.json(
        {
          message: "Chats get successfully",
          chat: { ...chat?._doc, messages: messages || [] },
        },
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
  const { chat_id, message, message_type } = await request.json();

  try {
    await dbConnect();

    if (!chat_id) {
      return NextResponse.json(
        { message: "Chat ID is required." },
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

    const newMessage = new Messages({
      chat_id,
      message_type,
      message,
      user_id: user._id,
    });

    await newMessage.save();
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const {
    _id,
    avatar,
    chat_name,
    first_name,
    last_name,
    email,
    mobile_number,
    unread_count,
    status,
    contact_id,
    recent_message,
  } = await request.json();

  try {
    await dbConnect();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
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
    const chat = await Chats.findOne({ user_id: user?._id, email: email });
    if (chat) {
      return NextResponse.json(
        { message: "Message sent successfully" },
        { status: 200 }
      );
    }
    const newChat = new Chats.findByIdAndUpdate(_id, {
      avatar,
      chat_name,
      first_name,
      last_name,
      email,
      mobile_number,
      unread_count,
      status,
      contact_id,
      user_id: user._id,
      recent_message,
    });

    await newChat.save();
    return NextResponse.json({ message: "Chat created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { _id } = await request.json();

    if (!_id) {
      return NextResponse.json(
        { message: "Please provide a chat ID." },
        { status: 400 }
      );
    }

    await dbConnect();

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

    const existingChat = await Chats.findOne({ user_id: user._id, _id });

    if (!existingChat) {
      return NextResponse.json(
        { message: "Chat not found for the provided ID." },
        { status: 404 }
      );
    }

    await Chats.findByIdAndDelete(_id);

    return NextResponse.json({ message: "Chat deleted." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
