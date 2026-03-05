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

  getById: async (id: string): Promise<AnimalWithRelations | null> => {
    try {
      return await http.request<AnimalWithRelations>(`/api/animals/${id}`);
    } catch (error) {
      console.warn(`Animal with id ${id} not found or request failed ${error}`);
      return null;
    }
  },

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
