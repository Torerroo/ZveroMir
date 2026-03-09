import { http } from "../http";
import type { AuthResponse, LoginData, RegisterData } from "./auth.schema";

export const authApi = {
  login: (data: LoginData) =>
    http.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterData) =>
    http.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => http.request<AuthResponse>("/auth/me"),

  logout: () =>
    http.request<void>("/auth/logout", {
      method: "POST",
    }),
};
