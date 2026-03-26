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

bookAccessSchema.index({bookId : 1});
bookAccessSchema.index({userId : 1});
bookAccessSchema.index({managerId : 1});

export const BookAccess = mongoose.model("BookAccess", bookAccessSchema);
