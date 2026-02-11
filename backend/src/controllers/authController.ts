import { CookieOptions, NextFunction, Response } from "express";
import { AuthRequest, COOKIE_NAME } from "../middleware/auth";
import {
  loginSchema,
  registerSchema,
} from "../validators/authValidation.schema";
import { validationError } from "../utils/errors";
import { authService } from "../services/authService";
import { AuthResponse } from "../types/userType";

const isProd = process.env.NODE_ENV === "PROD";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: (isProd ? "strict" : "lax") as "strict" | "lax",
  secure: isProd,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

class AuthController {
  login = async (
    req: AuthRequest,
    res: Response<AuthResponse>,
    next: NextFunction
  ) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(validationError(parsed.error));
      }

      const { user, token } = await authService.login(parsed.data);

      res.cookie(COOKIE_NAME, token, cookieOptions).json({ user });
    } catch (error) {
      next(error);
    }
  };

  register = async (
    req: AuthRequest,
    res: Response<AuthResponse>,
    next: NextFunction
  ) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(validationError(parsed.error));
      }

      const { user, token } = await authService.register(parsed.data);

      res.cookie(COOKIE_NAME, token, cookieOptions).status(201).json({ user });
    } catch (error) {
      next(error);
    }
  };

  me = async (
    req: AuthRequest,
    res: Response<AuthResponse>,
    next: NextFunction
  ) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: {
            message: "Необходима аутентификация",
            code: "UNAUTHORIZED",
          },
        } as any);
      }

      const user = authService.getMe(req.userId);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: AuthRequest, res: Response, _next: NextFunction) => {
    res.clearCookie(COOKIE_NAME, cookieOptions);
    res.status(204).send();
  };
}

export const authController = new AuthController();
