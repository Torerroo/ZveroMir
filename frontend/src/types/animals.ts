export type Gender = "Мальчик" | "Девочка" | "Неизвестно";

export type AnimalSize = "Маленький" | "Средний" | "Большой";

export type AnimalStatus = "Доступно" | "Зарезервировано" | "Пристроено";

export interface Animal {
  id: number;
  name: string;
  breed?: string | null;
  age?: number | null;
  gender: Gender;
  size: AnimalSize;
  status: AnimalStatus;
  description?: string | null;
  imageUrl?: string | null;
  categoryId?: number;
  speciesId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnimalWithRelations extends Animal {
  category: string;
  species: string;
}

export interface AnimalsResponse {
  animals: AnimalWithRelations[];
  total: number;
}

