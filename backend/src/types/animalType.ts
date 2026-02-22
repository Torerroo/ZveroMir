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

export interface AnimalRow {
  id: number;
  name: string;
  breed: string | null;
  age: number | null;
  gender: string;
  size: string;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  category_id: number;
  species_id: number;
  category_name: string;
  species_name: string;
  deleted_at: string | null;
}

export interface AnimalImageRow {
  id: number;
  animal_id: number;
  file_path: string;
  is_main: number;
}
