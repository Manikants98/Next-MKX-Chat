import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  profile_picture: {
    type: String,
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  last_name: {
    type: String,
    trim: true,
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
  token: {
    type: String,
    required: true,
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
  business_category_id: {
    type: String,
  },
  business_subcategory_id: {
    type: String,
  },
  country_id: {
    type: String,
  },
  state_id: {
    type: String,
  },
  city_id: {
    type: String,
  },
  area: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  instagram: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  role: {
    type: String,
  },
  last_modified_date: {
    type: Date,
    default: Date.now,
  },
});

export const User =
  mongoose.models.users || mongoose.model("users", userSchema);
