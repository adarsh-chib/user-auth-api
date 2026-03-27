import express, { NextFunction, Request, Response, Router } from "express";
import {
  assignUserToManager,
  createUser,
  getAllUser,
  resetPassword,
  updateUser,
  userDelete,
  userSignin,
} from "../controller/auth.controller";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  resetPasswordValidator,
  signinValidator,
  signupValidator,
  updateValidator,
} from "../validators/auth.validator";
import { profileUpload } from "../middleware/upload.middleware";

const router = express.Router();

router.post(
  "/auth/signup",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  profileUpload.single("profileImage"),
  
  validate(signupValidator),
  createUser,
);
router.post("/auth/signin", validate(signinValidator), userSignin);
router.get(
  "/auth/users",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  getAllUser,
);
router.patch(
  "/auth/update/:email",
  authenticationMiddleware,
  validate(updateValidator),
  updateUser,
);
router.delete(
  "/auth/delete/:email",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  userDelete,
);
router.patch(
  "/auth/reset-password",
  validate(resetPasswordValidator),
  resetPassword,
);
router.patch(
  "/auth/assign-user/:userId",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  assignUserToManager,
);

export default router;
