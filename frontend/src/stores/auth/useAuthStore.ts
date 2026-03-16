import { create } from "zustand";
import { User } from "../../types/user";
import { LoginData, RegisterData } from "../../api/auth/auth.schema";
import { api } from "@/api";
import { appToast } from "@/components/ui/AppToast";

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
      appToast.success(`Рады видеть вас, ${res.user.fullName || "друг"}!`);
    } catch (error) {
      set({ user: null, isAuth: false });
      appToast.error("Не удалось войти");
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
      appToast.success("До встречи! Возвращайтесь в ЗвероМир.");
    } catch (error) {
      set({ user: null, isAuth: false });
      console.error("Logout failed", error);
      appToast.error("Не удалось завершить сессию");
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
