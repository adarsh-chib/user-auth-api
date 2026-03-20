import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import { JWT_ACCESS_SECRET } from "../config/jwt";
import jwt from "jsonwebtoken";
import type { IUserPayload } from "../types/express";

type UserRole = "user" | "admin" | "manager";

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "access token is required"));
  }
  const token = authHeader.split(" ")[1];

  if (!JWT_ACCESS_SECRET) {
    return next(new ApiError(500, "JWT access secret is not congigured"));
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as IUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    next(new ApiError(401, "invalid or expired access token"));
  }
};


export const authorizationMiddleware = (
  ...allowedRoles: UserRole[]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "unauthorized"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "forbidden: access denied"));
    }

    next();
  };
};

export const adminOrOwnerByEmailMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new ApiError(401, "unauthorized"));
  }

  const targetEmail = req.params.email;

  if (!targetEmail) {
    return next(new ApiError(400, "target email is required"));
  }

  if (
    req.user.role === "admin" ||
    req.user.role === "manager" ||
    req.user.email === targetEmail
  ) {
    return next();
  }

  return next(new ApiError(403, "you can only access your own data"));
};

export const adminOrOwnerByUserIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new ApiError(401, "unauthorized"));
  }

  const targetUserId = req.params.userId;

  if (!targetUserId) {
    return next(new ApiError(400, "target user id is required"));
  }

  if (
    req.user.role === "admin" ||
    req.user.role === "manager" ||
    req.user.id === targetUserId
  ) {
    return next();
  }

  return next(new ApiError(403, "you can only access your own data"));
};
