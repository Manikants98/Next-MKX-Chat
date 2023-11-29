import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
});

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
