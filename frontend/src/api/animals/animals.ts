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
    http.request<AnimalsResponse>(`/animals${toSearchString(params)}`),

  getSpecies: () => http.request<SpeciesResponse[]>("/animals/species"),

  getById: async (id: string): Promise<AnimalWithRelations | null> => {
    try {
      return await http.request<AnimalWithRelations>(`/animals/${id}`);
    } catch (error) {
      console.warn(`Animal with id ${id} not found or request failed ${error}`);
      return null;
    }
  },

  create: (data: CreateAnimalData) =>
    http.request<AnimalWithRelations>("/animals", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: FormData) =>
    http.request<AnimalWithRelations>(`/animals/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (id: string) =>
    http.request<void>(`/animals/${id}`, {
      method: "DELETE",
    }),
};
