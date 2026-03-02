import { User } from "@/types/user";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(4, "Пароль должен быть не менее 4 символов"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(4, "Пароль должен быть не менее 4 символов"),
  fullName: z.string().min(1, "Имя обязательно").optional(),
});

export type RegisterData = z.infer<typeof registerSchema>;

export interface AuthResponse {
  user: User;
}

export interface AuthError {
  message: string;
  code?: string;
  details?: Record<string, string>;
}
