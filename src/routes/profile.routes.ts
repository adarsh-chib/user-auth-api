import Express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createProfile,
  getProfile,
  profileDelete,
  profileUpdate,
} from "../controller/profile.controller";
import { createProfileValidator } from "../validators/profile.validator";
import { validate } from "../middleware/validation.middleware";

const profileRouter = Express.Router();

profileRouter.post(
  "/profile/create",
  authMiddleware,
  createProfileValidator,
  validate,
  createProfile,
);
profileRouter.get("/profile/find", authMiddleware, getProfile);
profileRouter.patch(
  "/profile/update",
  authMiddleware,
  createProfileValidator,
  validate,
  profileUpdate,
);
profileRouter.delete("/profile/delete", authMiddleware, profileDelete);

export default profileRouter;
