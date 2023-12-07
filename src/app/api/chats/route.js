import dbConnect from "@/lib/db";
import { Chats } from "@/lib/model/chats";
import { User } from "@/lib/model/users";
import { NextResponse } from "next/server";
import { useToken } from "../helper";
import { Messages } from "@/lib/model/messages";

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
    const chatsWithoutCount = await Chats.find({ user_id: user?._id });

    const chats = await Promise.all(
      chatsWithoutCount.map(async (chat) => {
        try {
          const unreadMessagesCount = await Messages.countDocuments({
            chat_id: chat._id, // Check if chat._id matches Messages collection
            is_read: false,
          });

          console.log(
            `Chat ID: ${chat._id}, Unread Count: ${unreadMessagesCount}`
          );
          const chatObj = chat.toObject();
          chatObj.unread_count = unreadMessagesCount;
          return chatObj;
        } catch (err) {
          console.error(
            `Error counting unread messages for Chat ID: ${chat._id}`,
            err
          );
          throw err; // Rethrow error to handle it globally
        }
      })
    );

    console.log(chats, "Chats with Unread Counts");
    return NextResponse.json(
      { message: "Chats get successfully", chats },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const {
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

    const token = await useToken(request);

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
    const newChat = new Chats({
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

    const token = await useToken(request);

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

    const token = await useToken(request);

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
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: error.message },
      { status: 500 }
    );
  }
}
