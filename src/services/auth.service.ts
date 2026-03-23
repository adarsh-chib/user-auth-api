import bcrypt from "bcrypt";
import { User } from "../models/users.model";
import { generateRefreshToken } from "../utils/generaterefreshtoken";
import { generateAccessToken } from "../utils/generateaccesstoken";
import { ApiError } from "../utils/api.error";
import mongoose from "mongoose";

export const createUserService = async (
  name: string,
  email: string,
  password: string,
  role: string,
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(404, "user already existed");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,

    email,
    password: hashedPassword,
    role,
  });
  const userObject = newUser.toObject();
  delete userObject.password;

  return userObject;
};

export const userSigninServices = async (email: string, password: string) => {
  const existing_user = await User.findOne({ email });

  if (!existing_user) {
    throw new ApiError(404, "invalid email and password");
  }
  const isUserMatch = await bcrypt.compare(password, existing_user.password);

  if (!isUserMatch) {
    throw new ApiError(404, "invalid email and password");
  }

  const payload = {
    email: existing_user.email,
    role: existing_user.role,
    id: existing_user.id,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const userObject = existing_user.toObject();
  delete userObject.password;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

export const userUpdateService = async (
  email: string,
  update: {
    name?: string;
    email?: string;
    phoneNumber?: number;
    role?: "user" | "admin" | "manager";
    password?: string;
  },
) => {
  const userFind = await User.findOne({ email });

  if (!userFind) {
    throw new ApiError(404, "email does not exist");
  }

  const userUpdate = await User.findOneAndUpdate({ email }, update);
  const updateData = userUpdate.toObject();
  delete updateData.password;

  return updateData;
};

export const userDeleteServices = async (email: string) => {
  const findUser = await User.findOne({ email });

  if (!findUser) {
    throw new ApiError(404, "email does not exist");
  }

  const deleteUser = await User.findOneAndDelete({ email });
  return deleteUser;
};

export const resetPasswordService = async (
  email: string,
  newpassword: string,
) => {
  const findUser = await User.findOne({ email });

  if (!findUser) {
    throw new ApiError(404, "user does not exists");
  }

  const hashedPassword = await bcrypt.hash(newpassword, 10);

  const updateUser = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
  );

  if (!updateUser) {
    throw new ApiError(404, "user does not exists");
  }

  const userObject = updateUser.toObject();
  delete userObject.password;

  return userObject;
};

export const getAllUsersServices = async () => {
  const userdata = await User.find().select("-password");

  if (!userdata) {
    throw new ApiError(404, "user not found");
  }

  return userdata;
};

export const assignUserToManagerService = async (
  userID: string,
  managerId: string,
) => {
  const user = await User.findById(userID);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  if (user.role !== "user") {
    throw new ApiError(404, "only user can be assigned to manager");
  }

  const manager = await User.findById(managerId);
  if (!manager) {
    throw new ApiError(404, "manager not found");
  }
  if (manager.role !== "manager") {
    throw new ApiError(400, "assigned person must have the manager role");
  }
  user.assignedTo = new mongoose.Types.ObjectId(managerId);
  await user.save();

  const userObject = user.toObject();
  delete userObject.password;

  const managerObject = manager.toObject();
  delete managerObject.password;
  delete managerObject.assignedTo;

  return {
    user: userObject,
    manager: managerObject,
  };

};
