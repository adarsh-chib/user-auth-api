import express, { Router } from "express";
import {
  createUser,
  resetPassword,
  updateUser,
  userDelete,
  userSignin,
} from "../controller/auth.controller";
import {
  adminOrOwnerByEmailMiddleware,
  authenticationMiddleware,
} from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { resetPasswordValidator, signinValidator, signupValidator } from "../validators/auth.validator";

const router = express.Router();

router.post("/auth/signup", signupValidator, validate, createUser);
router.post("/auth/signin", signinValidator, validate, userSignin);
router.patch(
  "/auth/update/:email",
  authenticationMiddleware,
  adminOrOwnerByEmailMiddleware,
  updateUser,
);
router.delete(
  "/auth/delete/:email",
  authenticationMiddleware,
  adminOrOwnerByEmailMiddleware,
  userDelete,
);
router.patch("/auth/reset-password",resetPasswordValidator, validate, resetPassword);

export default router;
