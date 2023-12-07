import mongoose from "mongoose";
const messagesSchema = new mongoose.Schema({
  chat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chats",
    required: true,
  },
  message_type: {
    type: String,
    enum: ["image", "video", "text", "document"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  is: {
    type: String,
    enum: ["Sender", "Receiver"],
    required: true,
  },
});

export const Messages =
  mongoose.models.messages || mongoose.model("messages", messagesSchema);
