import express, { Router } from "express";
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
} from "../validators/auth.validator";

const router = express.Router();

router.post(
  "/auth/signup",
  signupValidator,
  validate,
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  createUser,
);
router.post("/auth/signin", signinValidator, validate, userSignin);
router.get(
  "/auth/users",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  getAllUser,
);
router.patch(
  "/auth/update/:email",
  authenticationMiddleware,
  resetPasswordValidator,
  validate,
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
  resetPasswordValidator,
  validate,
  resetPassword,
);
router.patch(
  "/auth/assign-user/:userId",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  assignUserToManager,
);

export default router;
