import { BookAccess } from "../models/bookAccess";
import { Book } from "../models/bookmanagement.model"
import { User } from "../models/users.model";
import { ApiError } from "../utils/api.error";
import mongoose from "mongoose";


export const BookToUserServices = async (
  bookId: string,
  managerId: string,
  userId: string
) => {
  const findManager = await User.findById(managerId);

  if (!findManager) {
    throw new ApiError(404, "this user is not found")
  }

  if (findManager.role !== "manager" && findManager.role !== "admin") {
    throw new ApiError(400, "only manager and admin can assigned the books")
  }

  const findbook = await Book.findById(bookId);
  if (!findbook) {
    throw new ApiError(404, "book not found")
  }

  const findUser = await User.findById(userId);

  if (!findUser) {
    throw new ApiError(404, "user not found")
  }

  if (findUser.role !== "user") {
    throw new ApiError(400, "the book can only assigned to user")
  }

  if (
    findManager.role === "manager" &&
    (!findUser.assignedTo || findUser.assignedTo.toString() !== managerId)
  ) {
    throw new ApiError(403, "this user is not assigned to this manager")
  }

  const existingAccess = await BookAccess.findOne({
    bookId,
    userId,
    managerId,
    status: "assigned",
  });

  if (existingAccess) {
    throw new ApiError(400, "book is already assigned to this user");
  }

  const access = await BookAccess.create({
    bookId: new mongoose.Types.ObjectId(bookId),
    userId: new mongoose.Types.ObjectId(userId),
    managerId: new mongoose.Types.ObjectId(managerId),
    status: "assigned",
  });

  return access;
}


export const getBooksServices = async (
  managerId: string
) => {


  const findManager = await User.findById(managerId);

  if (!findManager) {
    throw new ApiError(404, "this user is not found")
  }

  if (findManager.role !== "manager" && findManager.role !== "admin") {
    throw new ApiError(404, "role must be assigned to the manager and the admin")
  }

  const books = await BookAccess.find()
    .populate("bookId", "title")
    .populate("userId", "name")
    .populate("managerId", "name")

  return books.map((book: any) => ({
    ...book._doc,          //used to spread the _doc filed from the mongodb
    message: `${book.managerId.name} assigned ${book.bookId.title} to ${book.userId.name}`


  }))
}


export const getAssignBookByIdService = async (id: string) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid assignment ID format");
  }
  const findBook = await BookAccess.findOne({bookId :id})
    .populate<{ managerId: { name: string } }>("managerId", "name")
    .populate<{ bookId: { title: string } }>("bookId", "title")
    .populate<{ userId: { name: string } }>("userId", "name");
  if (!findBook) {
    throw new ApiError(404, "This book assignment was not found.");
  }

  return {
    ...findBook.toObject(),
    message: `${findBook.managerId?.name || "Unknown Manager"} assigned ${findBook.bookId?.title || "Unknown Book"} to ${findBook.userId?.name || "Unknown User"}`
  }
}













