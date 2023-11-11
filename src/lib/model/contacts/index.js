const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  profile_picture: {
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
    unique: true,
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
});

export const Contact =
  mongoose.models.contacts || mongoose.model("contacts", contactSchema);
