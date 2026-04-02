import { BookAccess } from "../models/bookAccess";
import { Book } from "../models/bookmanagement.model";
import { User } from "../models/users.model";
import { ApiError } from "../utils/api.error";
import mongoose from "mongoose";

export const AssignBookToUserServices = async(
  bookId : string,
  managerId : string,
  userId : string
)=>{
  const session = await mongoose.startSession();

  try{
    let updateAccess : any;

    await session.withTransaction(async ()=>{
      const findUser = await User.findById(userId).session(session);

      if(!findUser){
        throw new ApiError(404, "user not found");
      }

      const findBook = await BookAccess.findOne({
        bookId,
        userId,
        status : "assigned"
      }).session(session);

      if(findBook){
        throw new ApiError(400, "the book has been already assigned")
      }

      const bookUpdated = await Book.findOneAndUpdate(
        {
          _id: bookId,
          quantity: { $gt: 0 },
        },
        { $inc: { quantity: -1 } },
        { new: true, session }
      );

      if (!bookUpdated) {
        throw new ApiError(404, "book not found or out of stock");
      } 

      const accessDocs = await BookAccess.create(
        [
          {
            bookId,
            userId,
            managerId,
            status: "assigned",
          },
        ],
        { session }
      );

      updateAccess = accessDocs[0];
    });

    return await updateAccess.populate("bookId userId managerId");
  } finally {
    await session.endSession();
  }
};

export const getBooksServices = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID");
  }
  const booksAccess = await BookAccess.find({
    $or: [{ userId: id }, { managerId: id }],
  }).populate("bookId userId managerId");
  return booksAccess;
};

export const getAssignBookByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid assignment ID");
  }
  const assignment = await BookAccess.findById(id).populate(
    "bookId userId managerId",
  );
  if (!assignment) {
    throw new ApiError(404, "Book assignment not found");
  }
  return assignment;
};

export const revokeBookToUserServices = async (
  bookId: string,
  managerId: string,
  userId: string,
) => {
  const session = await mongoose.startSession();
  
  try {
    let updatedBook: any;
    let revokedAccess: any;

    await session.withTransaction(async () => {
      const findUser = await User.findById(userId).session(session);

      if (!findUser) {
        throw new ApiError(404, "user not found");
      }

      const existingAccess = await BookAccess.findOne({
        userId,
        bookId,
        status: "assigned",
      }).session(session);

      if (!existingAccess) {
        throw new ApiError(
          404,
          "this book is already revoked or not assigned to the user",
        );
      }

      if (existingAccess.managerId.toString() !== managerId) {
        throw new ApiError(403, "you can only revoke assignment you created");
      }

      const updateBook = await Book.findByIdAndUpdate(
        existingAccess.bookId,
        { $inc: { quantity: 1 } },
        { new: true, session },
      );

      if (!updateBook) {
        throw new ApiError(404, "book associated with this assignment not found");
      }

      existingAccess.status = "revoked";
      await existingAccess.save({ session });

      updatedBook = updateBook;
      revokedAccess = existingAccess;
    });

    return { book: updatedBook, access: revokedAccess };
  } finally {
    await session.endSession();
  }
};
