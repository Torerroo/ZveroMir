import { http } from "../http";
import type { AuthResponse } from "../../types/auth";
import type { LoginData, RegisterData } from "./auth.schema";

export const authApi = {
  login: (data: LoginData) =>
    http.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterData) =>
    http.request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => http.request<AuthResponse>("/api/auth/me"),

  logout: () =>
    http.request<void>("/api/auth/logout", {
      method: "POST",
    }),
};
