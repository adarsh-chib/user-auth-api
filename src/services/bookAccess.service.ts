import { BookAccess } from "../models/bookAccess";
import { Book } from "../models/bookmanagement.model"
import { User } from "../models/users.model";
import { ApiError } from "../utils/api.error";
import mongoose from "mongoose";


export const AssignBookToUserServices = async (
  bookId: string,
  managerId: string,
  userId: string
) => {

  const findUser = await User.findById(userId);
  if (!findUser) {
    throw new ApiError(404, "User not found");
  }

  const existingAccess = await BookAccess.findOne({
    bookId,
    userId,
    status: "assigned"
  });

  if (existingAccess) {
    throw new ApiError(400, "Already assigned");
  }

  const book = await Book.findOneAndUpdate(
    { _id: bookId, quantity: { $gt: 0 } },
    { $inc: { quantity: -1 } },
    { new: true }
  );

  if (!book) {
    throw new ApiError(404, "Book out of stock");
  }

  const access = await BookAccess.create({
    bookId,
    userId,
    managerId,
    status: "assigned"
  });

  // Populate to get the names for the success message
  return await access.populate("bookId userId managerId");
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
  const assignment = await BookAccess.findById(id).populate("bookId userId managerId");
  if (!assignment) {
    throw new ApiError(404, "Book assignment not found");
  }
  return assignment;
};



export const revokeBookToUserServices = async(
  bookId : string,
  managerId : string,
  userId : string,
)=>{
  const finduser = await User.findById(userId);

  if(!finduser){
    throw new ApiError(404, "user not found");
  }

   const existingAccess = await BookAccess.findOne({
    bookId,
    userId,
    status: "assigned"
  });
  if(!existingAccess){
    throw new ApiError(404, "this book is already revoked or not assigned to user");
  }

  if(existingAccess.managerId.toString() !== managerId){
    throw new ApiError(403, "you can only revoke assignment you created");
  }

  const book = await Book.findByIdAndUpdate(
    existingAccess.bookId,
    {$inc : {quantity : 1}},
    {new : true}
  );

  if(!book){
    throw new ApiError(404, "book associated with this assigment not found");
  }


  existingAccess.status = "revoked"

  await existingAccess.save();

  return {book, access: existingAccess}

}









