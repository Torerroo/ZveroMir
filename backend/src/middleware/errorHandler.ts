import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("error:", err);

  const status =
    err.statusCode && err.statusCode >= 400 && err.statusCode < 600
      ? err.statusCode
      : 500;

  const code = err.code || (status === 500 ? "INTERNAL_SERVER_ERROR" : "ERROR");

  res.status(status).json({
    error: {
      message: status === 500 ? "Внутренняя ошибка сервера" : err.message,
      code,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
