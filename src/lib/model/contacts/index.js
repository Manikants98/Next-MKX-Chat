const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  avatar: String,
  first_name: {
    type: String,
    required: true,
  },
  last_name: String,
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
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
    index: true,
  },
  instagram: String,
  linkedin: String,
  contact_type: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
    index: true,
  },
  last_modified_date: {
    type: Date,
    default: Date.now,
  },
  is_chat_active: {
    type: Boolean,
    default: false,
  },
});

export const Contact =
  mongoose.models.contacts || mongoose.model("contacts", contactSchema);
