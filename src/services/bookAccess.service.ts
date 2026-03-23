import { Book } from "../models/bookmanagement.model";
import { BookAccess } from "../models/bookAccess";
import { User } from "../models/users.model";
import { ApiError } from "../utils/api.error";
import mongoose from "mongoose";

export const assignBookToUserService = async (
  bookId: string,
  userId: string,
  managerId: string
) => {
  const findBook = await Book.findById(bookId);

  if (!findBook) {
    throw new ApiError(404, "book not found");
  }

  const userFind = await User.findById(userId);

  if (!userFind) {
    throw new ApiError(404, "user not found");
  }

  if (userFind.role !== "user") {
    throw new ApiError(400, "book can only be assigned to a user");
  }

  if (!userFind.assignedTo || userFind.assignedTo.toString() !== managerId) {
    throw new ApiError(403, "this user is not assigned to this manager");
  }

  const managerFind = await User.findById(managerId);

  if (!managerFind) {
    throw new ApiError(404, "manager not found");
  }

  if (managerFind.role !== "manager" && managerFind.role !== "admin") {
    throw new ApiError(400, "only manager or admin can assign books");
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
};
