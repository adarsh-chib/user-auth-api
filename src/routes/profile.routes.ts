import Express, { Router } from "express";
import {
  createProfile,
  getAllUserProfile,
  getProfile,
  profileDelete,
  profileUpdate,
} from "../controller/profile.controller";
import { createProfileValidator } from "../validators/profile.validator";
import { validate } from "../middleware/validation.middleware";
import {
  adminOrOwnerByUserIdMiddleware,
  authenticationMiddleware,
} from "../middleware/auth.middleware";

const profileRouter = Express.Router();

profileRouter.post(
  "/profile/create",
  authenticationMiddleware,
  createProfileValidator,
  validate,
  createProfile,
);
profileRouter.get(
  "/profile/find/:userId",
  authenticationMiddleware,
  adminOrOwnerByUserIdMiddleware,
  getProfile,
);

profileRouter.get(
  "/profile/users/:userId",
  authenticationMiddleware,
  adminOrOwnerByUserIdMiddleware,
  getAllUserProfile)

profileRouter.patch(
  "/profile/update/:userId",
  authenticationMiddleware,
  adminOrOwnerByUserIdMiddleware,
  createProfileValidator,
  validate,
  profileUpdate,
);
profileRouter.delete(
  "/profile/delete/:userId",
  authenticationMiddleware,
  adminOrOwnerByUserIdMiddleware,
  profileDelete,
);

export default profileRouter;
