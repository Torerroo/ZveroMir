export interface User {
  id: number;
  email: string;
  fullName: string | null;
  createdAt: string;
}

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  full_name: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
}

