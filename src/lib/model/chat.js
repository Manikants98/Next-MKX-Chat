import mongoose from "mongoose";

const chatModel = new mongoose.Schema({
  name: String,
});

export const Chat = mongoose.models.chats || mongoose.model("chats", chatModel);
