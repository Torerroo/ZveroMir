import { ZodError } from "zod";
import { AppError } from "../middleware/errorHandler";

export function validationError(zodError: ZodError): AppError {
  return {
    name: "ValidationError",
    message: "Некорректные параметры запроса",
    statusCode: 400,
    code: "INVALID_QUERY_PARAMS",
    details: zodError.format(),
  };
}

export function notFoundError(entity: string): AppError {
  return {
    name: "NotFoundError",
    message: `${entity} не найден`,
    statusCode: 404,
    code: "NOT_FOUND",
  };
}

export function forbiddenError(reason: string): AppError {
  return {
    name: "ForbiddenError",
    message: `Доступ запрещён: ${reason}`,
    statusCode: 403,
    code: "FORBIDDEN",
  };
}

export function unauthorizedError(message = "Необходима аутентификация"): AppError {
  return {
    name: "UnauthorizedError",
    message,
    statusCode: 401,
    code: "UNAUTHORIZED",
  };
}

