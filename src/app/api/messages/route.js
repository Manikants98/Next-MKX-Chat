import dbConnect from "@/lib/db";
import { Chats } from "@/lib/model/chats";
import { Contact } from "@/lib/model/contacts";
import { Messages } from "@/lib/model/messages";
import { User } from "@/lib/model/users";
import { NextResponse } from "next/server";
import { isTokenNotValidMessage, useSearchParams, useToken } from "../helper";

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

    const chat_id = query.get("chat_id");

    const chat = await Chats.findOne({ user_id: user?._id, _id: chat_id });
    const messages = await Messages.find({ chat_id });
    return NextResponse.json(
      {
        message: "Chats get successfully",
        chat: { ...chat?._doc, messages: messages || [] },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(request) {
  const { chat_id, email, message, message_type } = await request.json();

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

    const receiver = await User.findOne({ email });

    const contact = await Contact.findOne({ user_id: user._id, email });

    const isAlreadyExistChat = await Chats.findOne({
      user_id: receiver._id,
      email: user.email,
    });

    const isAlreadyExistContact = await Contact.findOne({
      user_id: receiver._id,
      email: user.email,
    });

    if (!chat_id) {
      const newSenderChat = new Chats({
        chat_name: (contact.first_name || "") + " " + (contact.last_name || ""),
        email: email,
        user_id: user._id,
      });
      await newSenderChat.save();
      const newSenderMessage = new Messages({
        chat_id: newSenderChat._id,
        message_type,
        message,
        sender: user._id,
        receiver: receiver._id,
        is: "Sender",
      });
      newSenderMessage.save();
      await Chats.findByIdAndUpdate(newSenderChat._id, {
        recent_message: {
          chat_id: newSenderChat._id,
          message_type,
          message,
          sender: user._id,
          receiver: receiver._id,
          is: "Sender",
        },
      });

      const parts = await user.email.split("@");
      const chat_name = await parts[0];

      if (isAlreadyExistChat) {
        const newReceiverMessage = new Messages({
          chat_id: isAlreadyExistChat._id,
          message_type,
          message,
          sender: user._id,
          receiver: receiver._id,
          is: "Receiver",
        });
        await newReceiverMessage.save();
        await Chats.findByIdAndUpdate(isAlreadyExistChat._id, {
          recent_message: {
            chat_id: isAlreadyExistChat._id,
            message_type,
            message,
            sender: user._id,
            receiver: receiver._id,
            is: "Receiver",
          },
        });
        return NextResponse.json(
          { message: "Message sent successfully" },
          { status: 201 }
        );
      }

      const newReceiverChat = new Chats({
        chat_name: isAlreadyExistContact
          ? `${isAlreadyExistContact.first_name || ""} ${
              isAlreadyExistContact.last_name || ""
            }`.trim()
          : chat_name,
        email: user.email,
        user_id: receiver._id,
      });

      await newReceiverChat.save();
      const newReceiverMessage = new Messages({
        chat_id: newReceiverChat._id,
        message_type,
        message,
        sender: user._id,
        receiver: receiver._id,
        is: "Receiver",
      });
      await newReceiverMessage.save();
      await Chats.findByIdAndUpdate(newReceiverChat._id, {
        recent_message: {
          chat_id: newReceiverChat._id,
          message_type,
          message,
          sender: user._id,
          receiver: receiver._id,
          is: "Receiver",
        },
      });
      return NextResponse.json(
        { message: "Message sent successfully" },
        { status: 201 }
      );
    }

    const newSenderMessage = new Messages({
      chat_id: chat_id,
      message_type,
      message,
      sender: user._id,
      receiver: receiver._id,
      is: "Sender",
    });
    await newSenderMessage.save();
    await Chats.findByIdAndUpdate(chat_id, {
      recent_message: {
        chat_id: chat_id,
        message_type,
        message,
        sender: user._id,
        receiver: receiver._id,
        is: "Sender",
      },
    });

    const parts = await user.email.split("@");
    const chat_name = await parts[0];

    if (isAlreadyExistChat) {
      const newReceiverMessage = new Messages({
        chat_id: isAlreadyExistChat._id,
        message_type,
        message,
        sender: user._id,
        receiver: receiver._id,
        is: "Receiver",
      });

      await newReceiverMessage.save();
      await Chats.findByIdAndUpdate(isAlreadyExistChat._id, {
        recent_message: {
          chat_id: isAlreadyExistChat._id,
          message_type,
          message,
          sender: user._id,
          receiver: receiver._id,
          is: "Receiver",
        },
      });

      return NextResponse.json(
        { message: "Message sent successfully" },
        { status: 201 }
      );
    }

    const newReceiverChat = new Chats({
      chat_name: isAlreadyExistContact
        ? `${isAlreadyExistContact.first_name || ""} ${
            isAlreadyExistContact.last_name || ""
          }`.trim()
        : chat_name,
      email: user.email,
      user_id: receiver._id,
    });
    await newReceiverChat.save();
    const newReceiverMessage = new Messages({
      chat_id: newReceiverChat._id,
      message_type,
      message,
      sender: user._id,
      receiver: receiver._id,
      is: "Receiver",
    });
    await newReceiverMessage.save();
    await Chats.findByIdAndUpdate(newReceiverChat._id, {
      recent_message: {
        chat_id: newReceiverChat._id,
        message_type,
        message,
        sender: user._id,
        receiver: receiver._id,
        is: "Receiver",
      },
    });
    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// export async function PUT(request) {
//   const {
//     _id,
//     avatar,
//     chat_name,
//     first_name,
//     last_name,
//     email,
//     mobile_number,
//     unread_count,
//     status,
//     contact_id,
//     recent_message,
//   } = await request.json();

//   try {
//     await dbConnect();

//     if (!email) {
//       return NextResponse.json(
//         { message: "Email is required." },
//         { status: 400 }
//       );
//     }

//     if (mobile_number && mobile_number.length !== 10) {
//       return NextResponse.json(
//         { message: "Mobile number must be a 10-digit numeric value." },
//         { status: 400 }
//       );
//     }

//     const token = await useToken(request);

//     if (!token) {
//       return NextResponse.json(
//         { message: "You need to log in first." },
//         { status: 401 }
//       );
//     }

//     const user = await User.findOne({ token });

//     if (!user) {
//       return NextResponse.json(
//         { message: "Provide a valid authorization token." },
//         { status: 401 }
//       );
//     }
//     const chat = await Chats.findOne({ user_id: user?._id, email: email });
//     if (chat) {
//       return NextResponse.json(
//         { message: "Message sent successfully" },
//         { status: 200 }
//       );
//     }
//     const newChat = Chats.findByIdAndUpdate(_id, {
//       avatar,
//       chat_name,
//       first_name,
//       last_name,
//       email,
//       mobile_number,
//       unread_count,
//       status,
//       contact_id,
//       user_id: user._id,
//       recent_message,
//     });

//     await newChat.save();
//     return NextResponse.json({ message: "Chat created." }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(request) {
//   try {
//     const { _id } = await request.json();

//     if (!_id) {
//       return NextResponse.json(
//         { message: "Please provide a chat ID." },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const token = await useToken(request);

//     if (!token) {
//       return NextResponse.json(
//         { message: "You need to log in first." },
//         { status: 401 }
//       );
//     }

//     const user = await User.findOne({ token });

//     if (!user) {
//       return NextResponse.json(
//         { message: "Provide a valid authorization token." },
//         { status: 401 }
//       );
//     }

//     const existingChat = await Chats.findOne({ user_id: user._id, _id });

//     if (!existingChat) {
//       return NextResponse.json(
//         { message: "Chat not found for the provided ID." },
//         { status: 404 }
//       );
//     }

//     await Chats.findByIdAndDelete(_id);

//     return NextResponse.json({ message: "Chat deleted." }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
