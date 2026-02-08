import {
  AnimalCreate,
  AnimalQuery,
  AnimalIdParams,
  AnimalUpdate,
} from "../validators/animalValidation.schema";
import { animalRepository } from "../repositories/animalRepository";
import { notFoundError } from "../utils/errors";

class AnimalService {
  async create(data: AnimalCreate) {
    const category = animalRepository.findCategoryByName(data.category);
    if (!category) {
      throw notFoundError("Категория");
    }

    const species = animalRepository.findSpeciesByNameAndCategory(
      data.species,
      category.id
    );
    if (!species) {
      throw notFoundError("Вид животного для указанной категории");
    }

    const animalData = {
      name: data.name,
      breed: data.breed,
      age: data.age ?? null,
      gender: data.gender,
      size: data.size,
      status: "Доступно" as const,
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? null,
      categoryId: category.id,
      speciesId: species.id,
      createdAt: new Date().toISOString(),
    };

    const newAnimalId = animalRepository.create(animalData);

    const createdAnimal = animalRepository.findById(newAnimalId);

    if (!createdAnimal) {
      throw new Error("Не удалось получить созданное животное");
    }

    return createdAnimal;
  }

  async getAll(filters?: AnimalQuery) {
    return animalRepository.findAll(filters);
  }

  async getById(id: AnimalIdParams["id"]) {
    const animal = animalRepository.findById(id);
    if (!animal) {
      throw notFoundError("Животное");
    }
    return animal;
  }

  async update(id: AnimalIdParams["id"], data: AnimalUpdate) {
    const existingAnimal = animalRepository.findById(id);
    if (!existingAnimal) {
      throw notFoundError("Животное");
    }

    const category = animalRepository.findCategoryByName(data.category);
    if (!category) {
      throw notFoundError("Категория");
    }

    const species = animalRepository.findSpeciesByNameAndCategory(
      data.species,
      category.id
    );
    if (!species) {
      throw notFoundError("Вид животного для указанной категории");
    }

    const updateData = {
      name: data.name,
      breed: data.breed,
      age: data.age ?? null,
      gender: data.gender,
      size: data.size,
      status: existingAnimal.status,
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? null,
      categoryId: category.id,
      speciesId: species.id,
    };

    const updated = animalRepository.update(id, updateData);
    if (!updated) {
      throw new Error("Не удалось обновить животное");
    }

    const updatedAnimal = animalRepository.findById(id);
    if (!updatedAnimal) {
      throw new Error("Не удалось получить обновленное животное");
    }

    return updatedAnimal;
  }

  async delete(id: AnimalIdParams["id"]) {
    const existingAnimal = animalRepository.findById(id);
    if (!existingAnimal) {
      throw notFoundError("Животное");
    }

    const deleted = animalRepository.delete(id);
    if (!deleted) {
      throw new Error("Не удалось удалить животное");
    }
  }
}

export const animalService = new AnimalService();
