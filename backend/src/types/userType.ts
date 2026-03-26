export interface User {
  id: number;
  email: string;
  fullName: string | null;
  createdAt: string;
}

export interface UserRow {
  id: number;
  email: string;
  passwordHash: string;
  fullName: string | null;
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
}

