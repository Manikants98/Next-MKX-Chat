const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  avatar: {
    type: String,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
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
  instagram: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  contact_type: {
    type: String,
  },
  user_id: {
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
  is_chat_active: {
    type: Boolean,
    default: false,
  },
});

export const Contact =
  mongoose.models.contacts || mongoose.model("contacts", contactSchema);
