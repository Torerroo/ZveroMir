import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path.startsWith("/api/auth")) {
    return next();
  }

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    const err: AppError = new Error("Нет токена");
    err.statusCode = 401;
    return next(err);
  }

  // Проверка JWT
  next();
};
