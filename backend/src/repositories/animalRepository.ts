import { db } from "../db";
import {
  AnimalRow,
  AnimalWithRelations,
  AnimalImageRow,
  AnimalImage,
} from "../types/animalType";
import { AnimalQuery } from "../validators/animalValidation.schema";

function mapRowToAnimal(row: AnimalRow): Omit<AnimalWithRelations, "images"> {
  return {
    id: row.id,
    name: row.name,
    breed: row.breed,
    age: row.age,
    gender: row.gender as any,
    size: row.size as any,
    status: row.status as any,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.category_name,
    species: row.species_name,
  };
}

class AnimalRepository {
  private getImagesForAnimals(animalIds: number[]): AnimalImage[] {
    if (animalIds.length === 0) return [];

    const placeholders = animalIds.map(() => "?").join(",");
    const rows = db
      .prepare(
        `SELECT id, animal_id, file_path, is_main 
         FROM animal_images 
         WHERE animal_id IN (${placeholders}) AND deleted_at IS NULL`,
      )
      .all(...animalIds) as AnimalImageRow[];

    return rows.map((row) => ({
      id: row.id,
      animalId: row.animal_id,
      url: row.file_path,
      isMain: Boolean(row.is_main),
    }));
  }

  findAll(filters: AnimalQuery = {}) {
    const conditions: string[] = ["a.deleted_at IS NULL"];
    const params: Record<string, any> = {};

    if (filters.categoryId) {
      conditions.push("a.category_id = @categoryId");
      params.categoryId = filters.categoryId;
    }
    if (filters.speciesId) {
      conditions.push("a.species_id = @speciesId");
      params.speciesId = filters.speciesId;
    }
    if (filters.speciesName) {
      conditions.push("s.name = @speciesName");
      params.speciesName = filters.speciesName;
    }
    if (filters.gender) {
      conditions.push("a.gender = @gender");
      params.gender = filters.gender;
    }
    if (filters.size) {
      conditions.push("a.size = @size");
      params.size = filters.size;
    }
    if (filters.q) {
      params.searchTerm = `%${filters.q.trim()}%`;
      conditions.push(
        "(a.name COLLATE NOCASE LIKE @searchTerm OR a.breed COLLATE NOCASE LIKE @searchTerm)",
      );
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;
    const totalResult = db
      .prepare(
        `SELECT COUNT(*) as total FROM animals a JOIN species s ON a.species_id = s.id ${whereClause}`,
      )
      .get(params) as { total: number };

    let paginationSql = "";
    if (filters.limit !== undefined) {
      paginationSql = " LIMIT @limit OFFSET @offset";
      params.limit = filters.limit;
      params.offset = filters.offset || 0;
    }

    const dataQuery = `
      SELECT 
        a.id, a.name, a.breed, a.age, a.gender, a.size, a.status, a.description,
        a.created_at, a.updated_at, a.category_id, a.species_id,
        c.name as category_name, 
        s.name as species_name
      FROM animals a
      JOIN categories c ON a.category_id = c.id
      JOIN species s ON a.species_id = s.id
      ${whereClause}
      ORDER BY a.created_at DESC
      ${paginationSql}
    `;

    const rows = db.prepare(dataQuery).all(params) as AnimalRow[];
    const animalIds = rows.map((r) => r.id);
    const allImages = this.getImagesForAnimals(animalIds);

    const animals = rows.map((row) => ({
      ...mapRowToAnimal(row),
      images: allImages.filter((img) => img.animalId === row.id),
    }));

    return { animals, total: totalResult.total };
  }

  findById(id: number): AnimalWithRelations | null {
    const query = `
      SELECT a.*, c.name as category_name, s.name as species_name
      FROM animals a
      JOIN categories c ON a.category_id = c.id
      JOIN species s ON a.species_id = s.id
      WHERE a.id = ? AND a.deleted_at IS NULL
    `;
    const row = db.prepare(query).get(id) as AnimalRow | undefined;
    if (!row) return null;

    return {
      ...mapRowToAnimal(row),
      images: this.getImagesForAnimals([id]),
    };
  }

  create(data: any): number {
    const query = `
      INSERT INTO animals (name, breed, age, gender, size, status, description, category_id, species_id)
      VALUES (@name, @breed, @age, @gender, @size, @status, @description, @categoryId, @speciesId)
    `;
    return db.prepare(query).run(data).lastInsertRowid as number;
  }

  update(id: number, data: any): boolean {
    const query = `
      UPDATE animals 
      SET name=@name, breed=@breed, age=@age, gender=@gender, size=@size, 
          status=@status, description=@description, category_id=@categoryId, species_id=@speciesId,
          updated_at=CURRENT_TIMESTAMP 
      WHERE id=@id
    `;
    return db.prepare(query).run({ ...data, id }).changes > 0;
  }

  syncImages(animalId: number, keepPaths: string[]) {
    if (keepPaths.length > 0) {
      const placeholders = keepPaths.map(() => "?").join(",");
      const query = `
				UPDATE animal_images 
				SET deleted_at = CURRENT_TIMESTAMP 
				WHERE animal_id = ? 
					AND LTRIM(file_path, '/') NOT IN (${placeholders}) 
					AND deleted_at IS NULL
			`;
      db.prepare(query).run(animalId, ...keepPaths);
    } else {
      const query = `UPDATE animal_images SET deleted_at = CURRENT_TIMESTAMP WHERE animal_id = ? AND deleted_at IS NULL`;
      db.prepare(query).run(animalId);
    }
  }

  addImages(animalId: number, filePaths: string[]) {
    const stmt = db.prepare(`
			INSERT INTO animal_images (animal_id, file_path, is_main) 
			VALUES (?, ?, 
				CASE 
					WHEN NOT EXISTS (
						SELECT 1 FROM animal_images 
						WHERE animal_id = ? AND is_main = 1 AND deleted_at IS NULL
					) THEN 1 
					ELSE 0 
				END
			)
		`);

    const insertMany = db.transaction((paths: string[]) => {
      for (const path of paths) {
        stmt.run(animalId, path, animalId);
      }
    });
    insertMany(filePaths);
  }

  findCategoryByName(name: string) {
    return db
      .prepare("SELECT id, name FROM categories WHERE name = ?")
      .get(name) as any;
  }

  findSpeciesByNameAndCategory(name: string, categoryId: number) {
    return db
      .prepare(
        "SELECT id, name FROM species WHERE name = ? AND category_id = ?",
      )
      .get(name, categoryId) as any;
  }

  getAllSpecies() {
    return db
      .prepare(
        "SELECT s.id, s.name, s.category_id as categoryId, c.name as categoryName FROM species s JOIN categories c ON s.category_id = c.id",
      )
      .all() as any[];
  }

  delete(id: number): boolean {
    return (
      db
        .prepare(
          "UPDATE animals SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
        )
        .run(id).changes > 0
    );
  }

  deleteImagesByAnimalId(animalId: number) {
    db.prepare(
      "UPDATE animal_images SET deleted_at = CURRENT_TIMESTAMP WHERE animal_id = ? AND deleted_at IS NULL",
    ).run(animalId);
  }
}

export const animalRepository = new AnimalRepository();
