export type Gender = "Мальчик" | "Девочка" | "Неизвестно";

export type AnimalSize = "Маленький" | "Средний" | "Большой";

export type AnimalStatus = "Доступно" | "Зарезервировано" | "Пристроено";

export interface Category {
  id: number;
  name: string;
}

export interface Species {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
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

export interface AnimalRow {
  id: number;
  name: string;
  breed: string | null;
  age: number | null;
  gender: string;
  size: string;
  status: string;
  description: string | null;
  imageUrl: string | null;
  created_at: string;
  updated_at: string;
  category_name: string;
  species_name: string;
  deleted_at: string | null;
}

export interface AnimalsResponse {
  animals: AnimalWithRelations[];
  total: number;
}
