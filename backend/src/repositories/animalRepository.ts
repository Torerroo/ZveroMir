import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";
import {
  AnimalWithRelations,
  AnimalImage,
  Gender,
  AnimalSize,
  AnimalStatus,
  AnimalCreateData,
  AnimalUpdateData,
} from "../types/animalType";
import { AnimalQuery } from "../validators/animalValidation.schema";

type AnimalWithJoins =
  Awaited<ReturnType<typeof prisma.animal.findFirst>> extends infer T
    ? T extends null
      ? never
      : T
    : never;

function mapRowToAnimal(
  row: AnimalWithJoins & {
    category: { name: string };
    species: { name: string };
  },
): Omit<AnimalWithRelations, "images"> {
  return {
    id: row.id,
    name: row.name,
    breed: row.breed,
    age: row.age,
    gender: row.gender as unknown as Gender,
    size: row.size as unknown as AnimalSize,
    status: row.status as unknown as AnimalStatus,
    description: row.description,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    category: row.category.name,
    species: row.species.name,
  };
}

class AnimalRepository {
  private async getImagesForAnimals(
    animalIds: number[],
  ): Promise<AnimalImage[]> {
    if (animalIds.length === 0) return [];

    const rows = await prisma.animalImage.findMany({
      where: {
        animalId: { in: animalIds },
        deletedAt: null,
      },
      select: {
        id: true,
        animalId: true,
        filePath: true,
        isMain: true,
      },
    });

    return rows.map((row) => ({
      id: row.id,
      animalId: row.animalId,
      url: row.filePath,
      isMain: row.isMain,
    }));
  }

  async findAll(filters: AnimalQuery = {}) {
    const where: Prisma.AnimalWhereInput = { deletedAt: null };
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.speciesId) where.speciesId = filters.speciesId;
    if (filters.speciesName) where.species = { name: filters.speciesName };
    if (filters.gender) where.gender = filters.gender;
    if (filters.size) where.size = filters.size;
    if (filters.q?.trim()) {
      const term = filters.q.trim();
      where.OR = [
        { name: { contains: term, mode: "insensitive" } },
        { breed: { contains: term, mode: "insensitive" } },
      ];
    }

    const [total, rows] = await prisma.$transaction([
      prisma.animal.count({ where }),
      prisma.animal.findMany({
        where,
        orderBy: { createdAt: "desc" },
        ...(filters.limit !== undefined
          ? { take: filters.limit, skip: filters.offset ?? 0 }
          : {}),
        include: {
          category: { select: { name: true } },
          species: { select: { name: true } },
        },
      }),
    ]);
    const animalIds = rows.map((r) => r.id);
    const allImages = await this.getImagesForAnimals(animalIds);

    const animals = rows.map((row) => ({
      ...mapRowToAnimal(row),
      images: allImages.filter((img) => img.animalId === row.id),
    }));

    return { animals, total };
  }

  async findById(id: number): Promise<AnimalWithRelations | null> {
    const row = await prisma.animal.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: { select: { name: true } },
        species: { select: { name: true } },
      },
    });
    if (!row) return null;

    return {
      ...mapRowToAnimal(row),
      images: await this.getImagesForAnimals([id]),
    };
  }

  async create(data: AnimalCreateData): Promise<number> {
    const created = await prisma.animal.create({
      data: {
        name: data.name,
        breed: data.breed,
        age: data.age,
        gender: data.gender,
        size: data.size,
        status: data.status,
        description: data.description,
        categoryId: data.categoryId,
        speciesId: data.speciesId,
      },
      select: { id: true },
    });
    return created.id;
  }

  async update(id: number, data: AnimalUpdateData): Promise<boolean> {
    const updateData: Parameters<typeof prisma.animal.updateMany>[0]["data"] = {
      name: data.name,
      breed: data.breed,
      gender: data.gender,
      size: data.size,
      status: data.status,
      categoryId: data.categoryId,
      speciesId: data.speciesId,
    };

    if (data.age !== undefined) {
      updateData.age = data.age;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    const updated = await prisma.animal.updateMany({
      where: { id },
      data: updateData,
    });
    return updated.count > 0;
  }

  async syncImages(animalId: number, keepPaths: string[]) {
    const existing = await prisma.animalImage.findMany({
      where: { animalId, deletedAt: null },
      select: { id: true, filePath: true },
    });

    const keepSet = new Set(keepPaths.map((p) => p.replace(/^\/+/, "")));
    const toDelete = existing
      .filter((img) => !keepSet.has(img.filePath.replace(/^\/+/, "")))
      .map((img) => img.id);

    if (toDelete.length > 0) {
      await prisma.animalImage.updateMany({
        where: { id: { in: toDelete } },
        data: { deletedAt: new Date() },
      });
    }
  }

  async addImages(animalId: number, filePaths: string[]) {
    if (filePaths.length === 0) return;

    const hasMain = await prisma.animalImage.findFirst({
      where: { animalId, isMain: true, deletedAt: null },
      select: { id: true },
    });

    await prisma.animalImage.createMany({
      data: filePaths.map((filePath, index) => ({
        animalId,
        filePath,
        isMain: !hasMain && index === 0,
      })),
    });
  }

  async findCategoryByName(name: string) {
    return prisma.category.findFirst({
      where: { name },
      select: { id: true, name: true },
    });
  }

  async findSpeciesByNameAndCategory(name: string, categoryId?: number) {
    if (!categoryId) return null;
    return prisma.species.findFirst({
      where: { name, categoryId },
      select: { id: true, name: true, categoryId: true },
    });
  }

  async getAllSpecies() {
    const rows = await prisma.species.findMany({
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      categoryId: row.categoryId,
      categoryName: row.category.name,
    }));
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await prisma.animal.updateMany({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return deleted.count > 0;
  }

  async deleteImagesByAnimalId(animalId: number) {
    await prisma.animalImage.updateMany({
      where: { animalId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}

export const animalRepository = new AnimalRepository();
