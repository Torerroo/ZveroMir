import {
  AnimalCreate,
  AnimalQuery,
  AnimalUpdate,
} from "../validators/animalValidation.schema";
import { animalRepository } from "../repositories/animalRepository";
import { notFoundError } from "../utils/errors";
import { AnimalWithRelations } from "../types/animalType";

class AnimalService {
  async getAll(filters: AnimalQuery = {}) {
    const result = await animalRepository.findAll(filters);
    result.animals.forEach((animal) => this.formatImageUrls(animal));
    return result;
  }

  async getById(id: number) {
    const animal = animalRepository.findById(id);
    if (!animal) throw notFoundError("Животное");

    this.formatImageUrls(animal);
    return animal;
  }

  async create(data: AnimalCreate, imagePaths: string[] = []) {
    const category = animalRepository.findCategoryByName(data.category);
    const species = animalRepository.findSpeciesByNameAndCategory(
      data.species,
      category?.id,
    );

    if (!category || !species) throw notFoundError("Категория или Вид");

    const animalId = animalRepository.create({
      name: data.name,
      breed: data.breed,
      age: data.age ?? null,
      gender: data.gender,
      size: data.size,
      status: "Доступно" as const,
      description: data.description ?? null,
      categoryId: category.id,
      speciesId: species.id,
    });

    if (imagePaths.length > 0) {
      animalRepository.addImages(animalId, imagePaths);
    }

    return this.getById(animalId);
  }

  async update(id: number, data: AnimalUpdate, imagePaths: string[] = []) {
    const existingAnimal = animalRepository.findById(id);
    if (!existingAnimal) throw notFoundError("Животное");

    const category = animalRepository.findCategoryByName(data.category);
    const species = animalRepository.findSpeciesByNameAndCategory(
      data.species,
      category?.id,
    );

    if (!category || !species) throw notFoundError("Категория или Вид");

    const updateData = {
      name: data.name,
      breed: data.breed,
      age: data.age ?? null,
      gender: data.gender,
      size: data.size,
      status: existingAnimal.status,
      description: data.description ?? null,
      categoryId: category.id,
      speciesId: species.id,
    };

    animalRepository.update(id, updateData);

    if (imagePaths.length > 0) {
      animalRepository.addImages(id, imagePaths);
    }

    return this.getById(id);
  }

  async getSpecies() {
    return animalRepository.getAllSpecies();
  }

  async delete(id: number) {
    if (!animalRepository.findById(id)) {
      throw notFoundError("Животное");
    }

    animalRepository.deleteImagesByAnimalId(id);

    animalRepository.delete(id);
  }

  private formatImageUrls(animal: AnimalWithRelations): void {
    animal.images.forEach((img) => {
      const cleanPath = img.url.startsWith("/") ? img.url : `/${img.url}`;
      img.url = `/static${cleanPath}`;
    });
  }
}

export const animalService = new AnimalService();
