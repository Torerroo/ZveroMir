import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Необработанная ошибка:", err);

  const status =
    err.statusCode && err.statusCode >= 400 && err.statusCode < 600
      ? err.statusCode
      : 500;

  const code = err.code || (status === 500 ? "INTERNAL_SERVER_ERROR" : "ERROR");

  res.status(status).json({
    error: {
      message: status === 500 ? "Внутренняя ошибка сервера" : err.message,
      code,
    },
  });
}
