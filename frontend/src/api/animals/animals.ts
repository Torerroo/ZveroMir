import { AnimalWithRelations } from "@/types/animals";
import { http } from "../http";
import { toSearchString } from "../utils";
import type {
  AnimalsResponse,
  SpeciesResponse,
  CreateAnimalData,
  UpdateAnimalData,
  AnimalsQueryParams,
} from "./animals.schema";

export const animalsApi = {
  getAll: (params?: AnimalsQueryParams) =>
    http.request<AnimalsResponse>(`/api/animals${toSearchString(params)}`),

  getSpecies: () => http.request<SpeciesResponse[]>("/api/animals/species"),

  getById: (id: string) =>
    http.request<AnimalWithRelations>(`/api/animals/${id}`),

  create: (data: CreateAnimalData) =>
    http.request<AnimalWithRelations>("/api/animals", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateAnimalData) =>
    http.request<AnimalWithRelations>(`/api/animals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    http.request<void>(`/api/animals/${id}`, {
      method: "DELETE",
    }),
};
