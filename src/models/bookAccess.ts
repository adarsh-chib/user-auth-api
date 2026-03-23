import mongoose, { Schema } from "mongoose";

const bookAccessSchema = new Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["assigned", "revoked"],
      default: "assigned",
    },
  },
  { timestamps: true }
);

export const BookAccess = mongoose.model("BookAccess", bookAccessSchema);
