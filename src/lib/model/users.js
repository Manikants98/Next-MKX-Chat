import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  profile_picture: {
    type: String,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      "Invalid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  mobile_number: {
    type: Number,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

export const User =
  mongoose.models.users || mongoose.model("users", userSchema);
