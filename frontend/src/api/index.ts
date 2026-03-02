import { animalsApi } from "./animals/animals";
import { authApi } from "./auth/auth";
import { http } from "./http";

export const api = {
  animals: animalsApi,
  auth: authApi,
};

export { http };

export type Api = typeof api;
