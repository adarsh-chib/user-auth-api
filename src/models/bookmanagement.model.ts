import mongoose, { Schema } from "mongoose";

export const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "author is required"],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, "isbn is required"],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
      min: [0, "quantity cannot be negative"],
      default: 0,
    },
    pdfUrl: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "category is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    publishedYear: {
      type: Number,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Book = mongoose.model("Book", bookSchema);
