import { create } from "zustand";
import { User } from "../types/user";
import { LoginData, RegisterData } from "../api/auth/auth.schema";
import { api } from "@/api";

interface AuthState {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;

  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuth: false,
  isLoading: true,

  login: async (data) => {
    try {
      const res = await api.auth.login(data);
      set({ user: res.user, isAuth: true });
    } catch (error) {
      set({ user: null, isAuth: false });
      throw error;
    }
  },

  register: async (data) => {
    try {
      const res = await api.auth.register(data);
      set({ user: res.user, isAuth: true });
    } catch (error) {
      set({ user: null, isAuth: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.auth.logout();
      set({ user: null, isAuth: false });
    } catch (error) {
      console.error("Logout failed", error);
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await api.auth.getMe();
      set({ user: res.user, isAuth: true });
    } catch (error) {
      console.error("Login store error:", error);
      set({ user: null, isAuth: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
