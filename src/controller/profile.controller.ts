import { NextFunction, Request, Response } from "express";
import {
  createProfileService,
  deleteProfileServices,
  getProfileServices,
  updateProfileServices,
} from "../services/profile.services";
import { ApiError } from "../utils/api.error";
import { ApiResponse } from "../utils/api.response";

export const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { bio, phoneNumber, address, avatar, dateOfBirth } = req.body;

  if (!req.user) {
    return next(new ApiError(401, "unauthorized"));
  }

  try {
    const profile = await createProfileService(req.user.id, {
      bio,
      phoneNumber,
      address,
      avatar,
      dateOfBirth,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "profile created successfully", profile));
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new ApiError(401, "unauthorized"));
  }

  try {
    const profile = await getProfileServices(req.user.id);
    return res
      .status(200)
      .json(new ApiResponse(200, "profile fetched successfully", profile));
  } catch (err) {
    next(err);
  }
};

export const profileUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { bio, phoneNumber, address, avatar, dateOfBirth } = req.body;
  if (!req.user) {
    return next(new ApiError(401, "unauthorized"));
  }

  try {
    const updateData = await updateProfileServices(req.user.id, {
      bio,
      phoneNumber,
      address,
      avatar,
      dateOfBirth,
    });

    return res
      .status(200)
      .json(new ApiResponse(201, "profile updated successfully", updateData));
  } catch (err) {
    next(err);
  }
};

export const profileDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new ApiError(401, "unauthorized"));
  }

  try {
    const profile = await deleteProfileServices(req.user.id);
    return res
      .status(200)
      .json(new ApiResponse(200, "profile deleted successfully", profile));
  } catch (err) {
    next(err);
  }
};
