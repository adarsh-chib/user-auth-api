import {
  assignUserToManagerService,
  createUserService,
  getAllUsersServices,
  resetPasswordService,
  userDeleteServices,
  userSigninServices,
  userUpdateService,
} from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/api.response";
import { ApiError } from "../utils/api.error";
import cloudinary from "../config/cloudinary";
import fs from "fs/promises";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password, role } = req.body;

  try {
    let profileImageUrl: string | undefined;

    if (req.file) {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profileImage", resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        stream.end(req.file!.buffer);
      });
      profileImageUrl = uploadResult.secure_url;
    }

    const user = await createUserService(profileImageUrl, name, email, password, role);
    return res
      .status(201)
      .json(
        new ApiResponse(201, `New user ${user.name} has been created`, user),
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
      .json(
        new ApiResponse(200, `user ${email} has been deleted`, userDeleted),
      );
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

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
  
  const page = req.query.page? parseInt(req.query.page as string) : undefined;
  const limit = req.query.limit? parseInt(req.query.limit as string) : undefined;
  const name = req.query.name as string;
  try {
    const userProfiles = await getAllUsersServices(page, limit, name);
    return res
      .status(200)
      .json(new ApiResponse(200, "all user fetched succesfully", userProfiles));
  } catch (err) {
    next(err);
  }
};

export const assignUserToManager = async (
  req: Request<{ userId: string }, {}, { managerId: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const { managerId } = req.body;

  if (!managerId) {
    return next(new ApiError(400, "manager id is required"));
  }

  try {
    const updatedData = await assignUserToManagerService(userId, managerId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `user ${updatedData.user.name} assigned to manager ${updatedData.manager.name} successfully`,
          updatedData,
        ),
      );
  } catch (err) {
    next(err);
  }
};
