import { Animal, AnimalWithRelations } from "@/types/animals";
import { z } from "zod";

export type CreateAnimalData = Omit<Animal, "id" | "createdAt" | "updatedAt">;

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

export const animalEditSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  breed: z.string().optional(),
  age: z.coerce
    .number({ message: "Возраст должен быть числом" })
    .min(0, "Возраст не может быть отрицательным")
    .max(50, "Возраст слишком большой"),
  gender: z.enum(["Мальчик", "Девочка", "Неизвестно"]),
  size: z.enum(["Маленький", "Средний", "Большой"]),
  description: z.string().optional(),
});

export type AnimalEditData = z.infer<typeof animalEditSchema>;
