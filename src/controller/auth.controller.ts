import {
  createUserService,
  resetPasswordService,
  userDeleteServices,
  userSigninServices,
  userUpdateService,
} from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/api.response";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await createUserService(name, email, password, role);
    return sendResponse(
      res,
      201,
      `New user ${user.name} has been created`,
      user,
    );
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
    return res.status(400).json({
      status: 400,
      message: "email, password are required",
    });
  }

  try {
    const user = await userSigninServices(email, password);

    if (!user) {
      sendResponse(res, 400, "User Credinatials worng ");
    }
    return sendResponse(res, 400, "login successfull", user);
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
    sendResponse(res, 400, "bad request");
  }

  try {
    const user = await userUpdateService(email, updatedata);
    sendResponse(res, 200, `user ${user.name} has been updated`, user);
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
    sendResponse(res, 200, `user ${email} has been deleted`, userDeleted);
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

    sendResponse(res, 200, "password reset successfully", updateData);
  } catch (err) {
    next(err);
  }
};
