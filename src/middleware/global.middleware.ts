import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const requestLoggger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });

  next();
};

