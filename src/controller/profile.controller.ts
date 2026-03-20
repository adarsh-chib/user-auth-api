import { NextFunction, Request, Response } from "express";
import {
  createProfileService,
  deleteProfileServices,
  getAllUserProfileServices,
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
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new ApiError(401, "unauthorized"));
  }

  try {
    const targetUserId = req.params.userId ?? req.user.id;
    const profile = await getProfileServices(targetUserId);
    return res
      .status(200)
      .json(new ApiResponse(200, "profile fetched successfully", profile));
  } catch (err) {
    next(err);
  }
};

export const profileUpdate = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { bio, phoneNumber, address, avatar, dateOfBirth } = req.body;
  if (!req.user) {
    return next(new ApiError(401, "unauthorized"));
  }

  try {
    const targetUserId = req.params.userId ?? req.user.id;
    const updateData = await updateProfileServices(targetUserId, {
      bio,
      phoneNumber,
      address,
      avatar,
      dateOfBirth,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "profile updated successfully", updateData));
  } catch (err) {
    next(err);
  }
};

export const profileDelete = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new ApiError(401, "unauthorized"));
  }

  try {
    const targetUserId = req.params.userId ?? req.user.id;
    const profile = await deleteProfileServices(targetUserId);
    return res
      .status(200)
      .json(new ApiResponse(200, "profile deleted successfully", profile));
  } catch (err) {
    next(err);
  }
};


export const getAllUserProfile = async(
  req : Request,
  res : Response,
  next : NextFunction,
)=>{

  try{
    const userProfiles = await getAllUserProfileServices()
    return res
    .status(200)
    .json(new ApiResponse(200, "all user profile fetched successfull",userProfiles))
  }
  catch(err){
     next(err);
  }
}
