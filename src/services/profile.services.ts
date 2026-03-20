import { UserProfile } from "../models/profile.model";
import { ApiError } from "../utils/api.error";

type CreateProfileInput = {
  bio: string;
  phoneNumber: number;
  address: string;
  avatar?: string;
  dateOfBirth: Date;
};

export const createProfileService = async (
  userId: string,
  profileData: CreateProfileInput,
) => {
  const findProfile = await UserProfile.findOne({ userId });

  if (findProfile) {
    throw new ApiError(409, "profile already exists");
  }

  const profile = await UserProfile.create({
    userId,

    ...profileData,
  });

  return profile;
};

export const getProfileServices = async (userId: string) => {
  const userProfile = await UserProfile.findOne({ userId });

  if (!userProfile) {
    throw new ApiError(404, "profile not found");
  }

  return userProfile;
};

export const updateProfileServices = async (
  userId: string,
  profileData: CreateProfileInput,
) => {
  const userUpdate = await UserProfile.findOne({ userId });

  if (!userUpdate) {
    throw new ApiError(404, "profile not found");
  }

  const userProfileUpdate = await UserProfile.findOneAndUpdate(
    {userId},
    profileData,
    {returnDocument : "after"}
  );

  if (!userProfileUpdate) {
    throw new ApiError(404, "profile not found");
  }
  

  return userProfileUpdate;
};



export const deleteProfileServices = async (userId: string) => {
  const userFind = await UserProfile.findOne({userId});

  if(!userFind){
    throw new ApiError(400, "profile not found")
  }

  const userProfileDelete = await UserProfile.findOneAndDelete({userId})

  return userProfileDelete;
}
