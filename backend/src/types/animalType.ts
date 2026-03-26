export type Gender = "Мальчик" | "Девочка" | "Неизвестно";
export type AnimalSize = "Маленький" | "Средний" | "Большой";
export type AnimalStatus = "Доступно" | "Зарезервировано" | "Пристроено";

export interface AnimalImage {
  id: number;
  animalId: number;
  url: string;
  isMain: boolean;
}

export interface Animal {
  id: number;
  name: string;
  breed?: string | null;
  age?: number | null;
  gender: Gender;
  size: AnimalSize;
  status: AnimalStatus;
  description?: string | null;
  categoryId: number;
  speciesId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnimalWithRelations extends Omit<
  Animal,
  "categoryId" | "speciesId"
> {
  category: string;
  species: string;
  images: AnimalImage[];
}

export interface AnimalsResponse {
  animals: AnimalWithRelations[];
  total: number;
}

export type AnimalCreateData = {
  name: string;
  breed: string | null;
  age: number | null;
  gender: Gender;
  size: AnimalSize;
  status: AnimalStatus;
  description: string | null;
  categoryId: number;
  speciesId: number;
};

export type AnimalUpdateData = {
  name: string;
  breed: string | null;
  age: number | null | undefined;
  gender: Gender;
  size: AnimalSize;
  status: AnimalStatus;
  description: string | null | undefined;
  categoryId: number;
  speciesId: number;
};
