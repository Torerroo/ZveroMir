import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

export type AuthRequest = Request & { userId?: number };

export const COOKIE_NAME = "session";

const PUBLIC_PATHS = ["/api/auth/login", "/api/auth/register"];

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  if (PUBLIC_PATHS.includes(req.path)) {
    return next();
  }

  if (req.method === "GET" && req.path.startsWith("/api/animals")) {
    return next();
  }

  const token =
    req.cookies?.[COOKIE_NAME] ??
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    const err: AppError = new Error("Нет доступа");
    err.statusCode = 401;
    return next(err);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err: AppError = new Error("Ошибка конфигурации");
    err.statusCode = 500;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: number };
    (req as AuthRequest).userId = decoded.userId;
    next();
  } catch {
    const err: AppError = new Error("Недействительный или истёкший токен");
    err.statusCode = 401;
    return next(err);
  }
};
