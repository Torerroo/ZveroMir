import { animalService } from "./animalService";
import { animalRepository } from "../repositories/animalRepository";
import { notFoundError } from "../utils/errors";
import type {
  AnimalCreate,
  AnimalUpdate,
} from "../validators/animalValidation.schema";

jest.mock("../repositories/animalRepository");

describe("AnimalService", () => {
  const mockCategory = { id: 1, name: "Собаки" };

  const mockSpecies = { id: 1, name: "Лабрадор", category_id: 1 };

  const makeMockAnimal = () => ({
    id: 1,
    name: "Бобик",
    breed: "Лабрадор",
    age: 3,
    gender: "Мальчик",
    size: "Большой",
    status: "Доступно",
    description: "Описание",
    categoryId: 1,
    speciesId: 1,
    created_at: "2026-03-17",
    images: [{ id: 1, url: "uploads/animal1.jpg" }],
    category: { ...mockCategory },
    species: { ...mockSpecies },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getById", () => {
    test("Успех: возвращает животное с отформатированными URL", async () => {
      (animalRepository.findById as jest.Mock).mockReturnValue(
        makeMockAnimal(),
      );

      const result = await animalService.getById(1);

      const firstImage = result.images?.[0];
      expect(firstImage).toBeDefined();
      expect(firstImage!.url).toBe("/static/uploads/animal1.jpg");
    });

    test("Ошибка: животное не найдено", async () => {
      (animalRepository.findById as jest.Mock).mockReturnValue(null);

      await expect(animalService.getById(999)).rejects.toEqual(
        notFoundError("Животное"),
      );
    });
  });

  describe("create", () => {
    const createData = {
      name: "Новое животное",
      breed: "Порода",
      age: 2,
      gender: "Мальчик",
      size: "Средний",
      category: "Собаки",
      species: "Лабрадор",
      description: "Описание",
    } satisfies AnimalCreate;

    test("Успех: создает животное", async () => {
      (animalRepository.findCategoryByName as jest.Mock).mockReturnValue(
        mockCategory,
      );
      (
        animalRepository.findSpeciesByNameAndCategory as jest.Mock
      ).mockReturnValue(mockSpecies);
      (animalRepository.create as jest.Mock).mockReturnValue(1);
      (animalRepository.findById as jest.Mock).mockReturnValue(
        makeMockAnimal(),
      );

      const result = await animalService.create(createData);

      expect(animalRepository.create).toHaveBeenCalledWith({
        name: createData.name,
        breed: createData.breed,
        age: createData.age,
        gender: createData.gender,
        size: createData.size,
        status: "Доступно",
        description: createData.description,
        categoryId: mockCategory.id,
        speciesId: mockSpecies.id,
      });
      expect(result).toBeDefined();
      const firstImage = result.images?.[0];
      expect(firstImage).toBeDefined();
      expect(firstImage!.url).toBe("/static/uploads/animal1.jpg");
    });

    test("Ошибка: категория не найдена", async () => {
      (animalRepository.findCategoryByName as jest.Mock).mockReturnValue(null);

      await expect(animalService.create(createData)).rejects.toEqual(
        notFoundError("Категория или Вид"),
      );
    });
  });

  describe("update", () => {
    const updateData = {
      name: "Обновленное имя",
      breed: "Новая порода",
      age: 4,
      gender: "Девочка",
      size: "Маленький",
      category: "Кошки",
      species: "Сиамская",
      description: "Новое описание",
      existingImages: ["static/uploads/old1.jpg", "static/uploads/old2.jpg"],
    } satisfies AnimalUpdate;

    const updatedCategory = { id: 2, name: "Кошки" };
    const updatedSpecies = { id: 2, name: "Сиамская", category_id: 2 };

    test("Успех: обновляет животное", async () => {
      const existingAnimal = makeMockAnimal();
      (animalRepository.findById as jest.Mock)
        .mockReturnValueOnce(existingAnimal)
        .mockReturnValueOnce(makeMockAnimal());

      (animalRepository.findCategoryByName as jest.Mock).mockReturnValue(
        updatedCategory,
      );
      (
        animalRepository.findSpeciesByNameAndCategory as jest.Mock
      ).mockReturnValue(updatedSpecies);

      const result = await animalService.update(1, updateData);

      expect(animalRepository.update).toHaveBeenCalledWith(1, {
        name: updateData.name,
        breed: updateData.breed,
        age: updateData.age,
        gender: updateData.gender,
        size: updateData.size,
        description: updateData.description,
        categoryId: updatedCategory.id,
        speciesId: updatedSpecies.id,
        status: existingAnimal.status,
      });
      expect(animalRepository.syncImages).toHaveBeenCalledWith(1, [
        "uploads/old1.jpg",
        "uploads/old2.jpg",
      ]);
      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    test("Успех: удаляет животное", async () => {
      (animalRepository.findById as jest.Mock).mockReturnValue(
        makeMockAnimal(),
      );

      await animalService.delete(1);

      expect(animalRepository.deleteImagesByAnimalId).toHaveBeenCalledWith(1);
      expect(animalRepository.delete).toHaveBeenCalledWith(1);
    });

    test("Ошибка: животное не найдено", async () => {
      (animalRepository.findById as jest.Mock).mockReturnValue(null);

      await expect(animalService.delete(999)).rejects.toEqual(
        notFoundError("Животное"),
      );
      expect(animalRepository.deleteImagesByAnimalId).not.toHaveBeenCalled();
      expect(animalRepository.delete).not.toHaveBeenCalled();
    });
  });
});
