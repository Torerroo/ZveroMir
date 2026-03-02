import { Animal, AnimalWithRelations } from "@/types/animals";

export type CreateAnimalData = Omit<Animal, "id" | "createdAt" | "updatedAt">;
export type UpdateAnimalData = Partial<CreateAnimalData>;

export type AnimalsQueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export interface AnimalsResponse {
  animals: AnimalWithRelations[];
  total: number;
}

export interface SpeciesResponse {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
}
