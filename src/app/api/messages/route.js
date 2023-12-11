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

    if (!chat_id) {
      return NextResponse.json(
        { message: "Please pass the chat_id in Query Param" },
        { status: 400 }
      );
    }
    const chat = await Chats.findOne({ _id: chat_id });

    if (!chat) {
      const contact = await Contact.findOne({ _id: chat_id });
      return NextResponse.json(
        {
          message: "Contact get successfully",
          contact: contact,
        },
        { status: 200 }
      );
    }

    const receiver = await User.findOne({ email: chat?.email });

    const receiverChat = await Chats.findOne({
      sender: receiver._id,
      email: user.email,
    });

    await Messages.updateMany(
      { chat_id: receiverChat._id },
      { $set: { is_read: true } }
    );

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
  const { email, message, message_type } = await request.json();

  try {
    const token = await useToken(request);
    if (!token) {
      return NextResponse.json({ message: isNotLoginMessage }, { status: 401 });
    }

    await dbConnect();
    const sender = await User.findOne({ token });

    if (!sender) {
      return NextResponse.json(
        { message: isTokenNotValidMessage },
        { status: 401 }
      );
    }
    const receiver = await User.findOne({ email });
    const isSenderChat = await Chats.findOne({ sender: sender._id, email });
    if (isSenderChat) {
      const newSenderMessage = new Messages({
        chat_id: isSenderChat._id,
        message_type,
        message,
        sender: sender._id,
        receiver: receiver._id,
        is: "Sender",
      });
      newSenderMessage.save();
      const isReceiverChat = await Chats.findOne({
        sender: receiver._id,
        email: sender.email,
      });
      let chat_name;
      if (isReceiverChat) {
        const newReceiverMessage = new Messages({
          chat_id: isReceiverChat._id,
          message_type,
          message,
          sender: receiver._id,
          receiver: sender._id,
          is: "Receiver",
        });
        newReceiverMessage.save();
        return NextResponse.json({ message: "Message sent." }, { status: 201 });
      }
      const isReceiverContact = await Chats.find({
        sender: receiver._id,
        email: sender.email,
      });
      chat_name =
        (isReceiverContact?.first_name || "") +
        " " +
        (isReceiverContact?.last_name || "");

      const newReceiverChat = new Chats({
        chat_name,
        email: sender.email,
        sender: receiver._id,
        receiver: sender._id,
      });
      newReceiverChat.save();

      const newReceiverMessage = new Messages({
        chat_id: newReceiverChat._id,
        message_type,
        message,
        sender: receiver._id,
        receiver: sender._id,
        is: "Receiver",
      });
      newReceiverMessage.save();
    }
    return NextResponse.json({ message: "Message sent." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// const receiver = await User.findOne({ email });

// const senderContact = await Contact.findOne({ user_id: user._id, email });

// const isAlreadyExistChat = await Chats.findOne({
//   sender: user._id,
//   email: user.email,
// });

// const receiverContact = await Contact.findOne({
//   user_id: receiver._id,
//   email: user.email,
// });

// if (!chat_id) {
//   const newSenderChat = new Chats({
//     chat_name:
//       (senderContact.first_name || "") +
//       " " +
//       (senderContact.last_name || ""),
//     email: email,
//     sender: user._id,
//     receiver: receiver._id,
//   });
//   await newSenderChat.save();
//   const newSenderMessage = new Messages({
//     chat_id: newSenderChat._id,
//     message_type,
//     message,
//     sender: user._id,
//     receiver: receiver._id,
//     is: "Sender",
//   });
//   newSenderMessage.save();
//   await Chats.findByIdAndUpdate(newSenderChat._id, {
//     recent_message: newSenderMessage._id,
//   });

//   const chat_name = await (receiverContact
//     ? (receiverContact.first_name || "") + (receiverContact.last_name || "")
//     : user.email.split("@")[0]);

//   if (isAlreadyExistChat) {
//     const newReceiverMessage = new Messages({
//       chat_id: isAlreadyExistChat._id,
//       message_type,
//       message,
//       sender: user._id,
//       receiver: receiver._id,
//       is: "Receiver",
//     });
//     await newReceiverMessage.save();
//     await Chats.findByIdAndUpdate(isAlreadyExistChat._id, {
//       recent_message: newReceiverMessage._id,
//     });
//     return NextResponse.json(
//       { message: "Message sent.", chat: newSenderChat },
//       { status: 201 }
//     );
//   }

//   const newReceiverChat = new Chats({
//     chat_name,
//     email: user.email,
//     sender: receiver._id,
//     receiver: user._id,
//   });

//   console.log("mkx");

//   await newReceiverChat.save();
//   const newReceiverMessage = new Messages({
//     chat_id: newReceiverChat._id,
//     message_type,
//     message,
//     sender: user._id,
//     receiver: receiver._id,
//     is: "Receiver",
//   });
//   await newReceiverMessage.save();
//   await Chats.findByIdAndUpdate(newReceiverChat._id, {
//     recent_message: newReceiverMessage._id,
//   });
//   return NextResponse.json(
//     { message: "Message sent.", chat: newReceiverChat },
//     { status: 201 }
//   );
// }

// const newSenderMessage = new Messages({
//   chat_id: chat_id,
//   message_type,
//   message,
//   sender: user._id,
//   receiver: receiver._id,
//   is: "Sender",
// });
// await newSenderMessage.save();
// await Chats.findByIdAndUpdate(chat_id, {
//   recent_message: newSenderMessage._id,
// });

// const chat_name = await (receiverContact
//   ? (receiverContact.first_name || "") + (receiverContact.last_name || "")
//   : user.email.split("@")[0]);

// if (isAlreadyExistChat) {
//   const newReceiverMessage = new Messages({
//     chat_id: isAlreadyExistChat._id,
//     message_type,
//     message,
//     sender: user._id,
//     receiver: receiver._id,
//     is: "Receiver",
//   });

//   await newReceiverMessage.save();
//   await Chats.findByIdAndUpdate(isAlreadyExistChat._id, {
//     recent_message: newReceiverMessage._id,
//   });

//   return NextResponse.json({ message: "Message sent." }, { status: 201 });
// }

// const newReceiverChat = new Chats({
//   chat_name,
//   email: user.email,
//   sender: receiver._id,
//   receiver: user._id,
// });
// await newReceiverChat.save();
// const newReceiverMessage = new Messages({
//   chat_id: newReceiverChat._id,
//   message_type,
//   message,
//   sender: user._id,
//   receiver: receiver._id,
//   is: "Receiver",
// });
// await newReceiverMessage.save();
// await Chats.findByIdAndUpdate(newReceiverChat._id, {
//   recent_message: newReceiverMessage._id,
// });
