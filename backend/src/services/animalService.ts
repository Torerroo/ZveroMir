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
    const animal = await animalRepository.findById(id);
    if (!animal) throw notFoundError("Животное");

    this.formatImageUrls(animal);
    return animal;
  }

  async create(data: AnimalCreate, imagePaths: string[] = []) {
    const category = await animalRepository.findCategoryByName(data.category);
    const species = await animalRepository.findSpeciesByNameAndCategory(
      data.species,
      category?.id,
    );

    if (!category || !species) throw notFoundError("Категория или Вид");

    const animalId = await animalRepository.create({
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
      await animalRepository.addImages(animalId, imagePaths);
    }

    return this.getById(animalId);
  }

  async update(id: number, data: AnimalUpdate, newImagePaths: string[] = []) {
    const existingAnimal = await animalRepository.findById(id);
    if (!existingAnimal) throw notFoundError("Животное");

    const category = await animalRepository.findCategoryByName(data.category);
    const species = await animalRepository.findSpeciesByNameAndCategory(
      data.species,
      category?.id,
    );
    if (!category || !species) throw notFoundError("Категория или Вид");

    await animalRepository.update(id, {
      name: data.name,
      breed: data.breed,
      age: data.age,
      gender: data.gender,
      size: data.size,
      description: data.description,
      categoryId: category.id,
      speciesId: species.id,
      status: existingAnimal.status,
    });

    const keepImages = (data.existingImages || []).map((path) =>
      path.replace(/^\/?static\//, "").replace(/^\/+/, ""),
    );

    await animalRepository.syncImages(id, keepImages);

    if (newImagePaths.length > 0) {
      const cleanNewPaths = newImagePaths.map((p) => p.replace(/^\/+/, ""));
      await animalRepository.addImages(id, cleanNewPaths);
    }

    return this.getById(id);
  }

  async getSpecies() {
    return animalRepository.getAllSpecies();
  }

  async delete(id: number) {
    if (!(await animalRepository.findById(id))) {
      throw notFoundError("Животное");
    }
    await animalRepository.deleteImagesByAnimalId(id);
    await animalRepository.delete(id);
  }

  private formatImageUrls(animal: AnimalWithRelations): void {
    animal.images.forEach((img) => {
      const cleanPath = img.url.replace(/^\/+/, "");
      img.url = `/static/${cleanPath}`;
    });
  }
}

export const animalService = new AnimalService();
