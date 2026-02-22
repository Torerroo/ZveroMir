import { Request, Response, NextFunction } from "express";
import multer from "multer";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("error:", err);

  if (err instanceof multer.MulterError) {
    let message = "Ошибка при загрузке файлов";
    if (err.code === "LIMIT_FILE_SIZE")
      message = "Файл слишком большой (макс. 5МБ)";
    if (err.code === "LIMIT_FILE_COUNT")
      message = "Превышено максимальное количество файлов (макс. 5)";

    return res.status(400).json({
      error: {
        message,
        code: "FILE_UPLOAD_ERROR",
        details: [{ path: ["images"], message: err.code }],
      },
    });
  }

  if (err.message && err.message.includes("Разрешены только")) {
    return res.status(400).json({
      error: {
        message: err.message,
        code: "INVALID_FILE_FORMAT",
        details: [{ path: ["images"], message: err.message }],
      },
    });
  }

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
