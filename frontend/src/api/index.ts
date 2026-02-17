import { animalsApi } from "./animals/animals";
import { http } from "./http";

export const api = {
  animals: animalsApi,
};

export { http };

export type Api = typeof api;
