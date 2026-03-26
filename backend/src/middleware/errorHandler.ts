import { Request, Response, NextFunction } from "express";
import multer from "multer";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandler(
  err: unknown,
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

  const appErr = err as Partial<AppError> & { message?: unknown };

  if (typeof appErr.message === "string" && appErr.message.includes("Разрешены только")) {
    return res.status(400).json({
      error: {
        message: appErr.message,
        code: "INVALID_FILE_FORMAT",
        details: [{ path: ["images"], message: appErr.message }],
      },
    });
  }

  const status =
    typeof appErr.statusCode === "number" &&
    appErr.statusCode >= 400 &&
    appErr.statusCode < 600
      ? appErr.statusCode
      : 500;

  const code =
    appErr.code || (status === 500 ? "INTERNAL_SERVER_ERROR" : "ERROR");

  const message =
    status === 500
      ? "Внутренняя ошибка сервера"
      : typeof appErr.message === "string"
        ? appErr.message
        : "Ошибка";

  res.status(status).json({
    error: {
      message,
      code,
      ...(appErr.details ? { details: appErr.details } : {}),
    },
  });
}
