import type {
  Animal,
  AnimalWithRelations,
  AnimalsResponse,
} from "../../types/animals";
import { http } from "../http";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function toSearchString(params?: QueryParams): string {
  if (!params) return "";

  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null
  );

  if (!entries.length) return "";

  const searchParams = new URLSearchParams();

  for (const [key, value] of entries) {
    searchParams.append(key, String(value));
  }

  return `?${searchParams.toString()}`;
}

export const animalsApi = {
  getAll: (params?: QueryParams) =>
    http.request<AnimalsResponse>(`/api/animals${toSearchString(params)}`),

  getById: (id: string) =>
    http.request<AnimalWithRelations>(`/api/animals/${id}`),

  create: (data: Omit<Animal, "id" | "createdAt" | "updatedAt">) =>
    http.request<AnimalWithRelations>("/api/animals", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: Partial<Omit<Animal, "id" | "createdAt" | "updatedAt">>
  ) =>
    http.request<AnimalWithRelations>(`/api/animals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    http.request<void>(`/api/animals/${id}`, {
      method: "DELETE",
    }),
};
