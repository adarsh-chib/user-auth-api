import {
  createUserService,
  resetPasswordService,
  userDeleteServices,
  userSigninServices,
  userUpdateService,
} from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/api.response";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await createUserService(name, email, password, role);
    return res
      .status(201)
      .json(new ApiResponse(201, `New user ${user.name} has been created`, user));
  } catch (err) {
    next(err);
  }
};

export const userSignin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, "email, password are required", undefined));
  }

  try {
    const user = await userSigninServices(email, password);

    if (!user) {
      return res
        .status(400)
        .json(new ApiResponse(400, "User Credinatials worng ", undefined));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "login successfull", user));
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request<{ email: string }>,
  res: Response,
  next: NextFunction,
) => {
  const email = req.params.email;
  const updatedata = req.body;

  if (!updatedata) {
    return res.status(400).json(new ApiResponse(400, "bad request", undefined));
  }

  try {
    const user = await userUpdateService(email, updatedata);
    return res
      .status(200)
      .json(new ApiResponse(200, `user ${user.name} has been updated`, user));
  } catch (err) {
    next(err);
  }
};

export const userDelete = async (
  req: Request<{ email: string }>,
  res: Response,
  next: NextFunction,
) => {
  const email = req.params.email;

  try {
    const userDeleted = await userDeleteServices(email);
    return res
      .status(200)
      .json(new ApiResponse(200, `user ${email} has been deleted`, userDeleted));
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request<{ email: string; newpassword: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { email, newpassword } = req.body;

  try {
    const updateData = await resetPasswordService(email, newpassword);

    return res
      .status(200)
      .json(new ApiResponse(200, "password reset successfully", updateData));
  } catch (err) {
    next(err);
  }
};
