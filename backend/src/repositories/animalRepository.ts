import { db } from "../db";
import { AnimalRow, AnimalWithRelations } from "../types/animalType";
import { AnimalQuery } from "../validators/animalValidation.schema";

function mapRowToAnimal(row: AnimalRow): AnimalWithRelations {
  return {
    id: row.id,
    name: row.name,
    breed: row.breed,
    age: row.age,
    gender: row.gender as any,
    size: row.size as any,
    status: row.status as any,
    description: row.description,
    imageUrl: row.imageUrl,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.category_name,
    species: row.species_name,
  };
}

class AnimalRepository {
  findAll(filters: AnimalQuery = {}): {
    animals: AnimalWithRelations[];
    total: number;
  } {
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
      const searchTerm = `%${filters.q.trim()}%`;
      conditions.push(
        "(a.name COLLATE NOCASE LIKE @searchTerm OR a.breed COLLATE NOCASE LIKE @searchTerm)"
      );
      params.searchTerm = searchTerm;
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    // 1. Считаем total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM animals a 
      JOIN species s ON a.species_id = s.id 
      ${whereClause}
    `;
    const totalResult = db.prepare(countQuery).get(params) as { total: number };

    // 2. Строим запрос данных с динамической пагинацией
    let paginationSql = "";
    if (filters.limit !== undefined) {
      paginationSql += " LIMIT @limit";
      params.limit = filters.limit;
      if (filters.offset !== undefined) {
        paginationSql += " OFFSET @offset";
        params.offset = filters.offset;
      }
    }

    const dataQuery = `
      SELECT
        a.id, a.name, a.breed, a.age, a.gender, a.size, a.status,
        a.description, a.image_url as imageUrl,
        a.created_at as created_at, a.updated_at as updated_at,
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

    return {
      animals: rows.map(mapRowToAnimal),
      total: totalResult.total,
    };
  }

  // Остальные методы без изменений, но убедись что они есть
  findById(id: number): AnimalWithRelations | null {
    const query = `
      SELECT a.*, c.name as category_name, s.name as species_name
      FROM animals a
      JOIN categories c ON a.category_id = c.id
      JOIN species s ON a.species_id = s.id
      WHERE a.id = @id AND a.deleted_at IS NULL
    `;
    const row = db.prepare(query).get({ id }) as AnimalRow | undefined;
    return row ? mapRowToAnimal(row) : null;
  }

  create(data: any): number {
    const query = `INSERT INTO animals (name, breed, age, gender, size, status, description, image_url, category_id, species_id, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
    return db.prepare(query).run(...Object.values(data))
      .lastInsertRowid as number;
  }

  findCategoryByName(name: string) {
    return db
      .prepare("SELECT id, name FROM categories WHERE name = ?")
      .get(name) as any;
  }

  findSpeciesByNameAndCategory(name: string, categoryId: number) {
    return db
      .prepare(
        "SELECT id, name FROM species WHERE name = ? AND category_id = ?"
      )
      .get(name, categoryId) as any;
  }

  update(id: number, data: any): boolean {
    const query = `UPDATE animals SET name=?, breed=?, age=?, gender=?, size=?, status=?, description=?, image_url=?, category_id=?, species_id=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`;
    return db.prepare(query).run(...Object.values(data), id).changes > 0;
  }

  delete(id: number): boolean {
    return (
      db
        .prepare(
          "UPDATE animals SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?"
        )
        .run(id).changes > 0
    );
  }
}

export const animalRepository = new AnimalRepository();
