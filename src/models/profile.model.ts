import express from "express";
import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  bio: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  address: { type: String, required: true },
  avatar: {
    type: String,
    default: null,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
});

export const UserProfile = mongoose.model("UserProfile", userSchema);
