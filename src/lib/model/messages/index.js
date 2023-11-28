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
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Messages =
  mongoose.models.messages || mongoose.model("messages", messagesSchema);
