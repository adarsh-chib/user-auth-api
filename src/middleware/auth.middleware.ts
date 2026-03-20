import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import { JWT_ACCESS_SECRET } from "../config/jwt";
import jwt from "jsonwebtoken";
import type { IUserPayload } from "../types/express";


export const authMiddleware = (
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

export const authorizesRoles = (...roles: ("user" | "admin" | "manager")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "unauthorized user"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "forbidden"));
    }

    next();
  };
};
