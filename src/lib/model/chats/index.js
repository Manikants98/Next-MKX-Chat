const mongoose = require("mongoose");
const chatsSchema = new mongoose.Schema({
  avatar: {
    type: String,
  },
  chat_name: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  mobile_number: {
    type: String,
    validate: {
      validator: function (value) {
        if (value) {
          return /^\d{10}$/.test(value);
        }
        return true;
      },
      message: "Number must be a 10-digit string.",
    },
  },
  recent_message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "messages",
  },
  unread_count: {
    type: Number,
  },
  status: {
    type: String,
  },
  user_id: {
    type: String,
  },
  contact_id: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  last_modified_date: {
    type: Date,
    default: Date.now,
  },
});

export const Chats =
  mongoose.models.chats || mongoose.model("chats", chatsSchema);
