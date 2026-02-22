import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

export type AuthRequest = Request & { userId?: number };
export const COOKIE_NAME = "session";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.[COOKIE_NAME] ??
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    const err: AppError = new Error("Нет доступа: токен отсутствует");
    err.statusCode = 401;
    return next(err);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err: AppError = new Error("Ошибка конфигурации сервера");
    err.statusCode = 500;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: number };
    (req as AuthRequest).userId = decoded.userId;
    next();
  } catch (error) {
    const err: AppError = new Error("Недействительный или истёкший токен");
    err.statusCode = 401;
    return next(err);
  }
};
