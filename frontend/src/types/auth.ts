export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  user: User;
}

export interface AuthError {
  message: string;
  code?: string;
  details?: Record<string, string>;
}
