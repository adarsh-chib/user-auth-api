import express from 'express'
import mongoose, { Schema } from 'mongoose'

export const userSchema = new Schema({
  profileImage : {type : String, required : false},
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"],
  },
  phoneNumber: Number,
  role: {
    type: String,
    enum: ["user", "admin", "manager"],
    default: "user",
  },
  password: {
    type : String,
    required : [ true, "password is required"],
    unique : true,

  },
  assignedTo: {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    default: null,
  }
});

export const User = mongoose.model('User', userSchema);