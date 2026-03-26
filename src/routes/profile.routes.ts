import Express, { Router } from "express";
import {
  createProfile,
  getAllUserProfile,
  getProfile,
  profileDelete,
  profileUpdate,
} from "../controller/profile.controller";
import { validate } from "../middleware/validation.middleware";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";
import { createProfileValidator } from "../validators/profile.validator";

const profileRouter = Express.Router();

profileRouter.post(
  "/profile/create",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  validate(createProfileValidator),
  createProfile,
);
profileRouter.get(
  "/profile/find/:userId",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  getProfile,
);

profileRouter.get(
  "/profile/users",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  getAllUserProfile,
);

profileRouter.patch(
  "/profile/update",
  authenticationMiddleware,
  authorizationMiddleware("admin","manager","user"),
  validate(createProfileValidator),
  profileUpdate,
);
profileRouter.delete(
  "/profile/delete/:userId",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  profileDelete,
);

export default profileRouter;
