import { db } from "../db";
import { AnimalRow, AnimalWithRelations } from "../types/animalType";

function mapRowToAnimal(row: AnimalRow): AnimalWithRelations {
  return {
    id: row.id,
    name: row.name,
    breed: row.breed,
    age: row.age,
    gender: row.gender as "Мальчик" | "Девочка" | "Неизвестно",
    size: row.size as "Маленький" | "Средний" | "Большой",
    status: row.status as "Доступно" | "Зарезервировано" | "Пристроено",
    description: row.description,
    imageUrl: row.imageUrl,
    createdAt: row.created_at,
    category: row.category_name,
    species: row.species_name,
  };
}

class AnimalRepository {
  findAll(filters?: {
    categoryId?: number | undefined;
    speciesId?: number | undefined;
    q?: string | undefined;
  }): AnimalWithRelations[] {
    const conditions: string[] = [];
    const params: Record<string, number | string> = {};

    if (filters?.categoryId !== undefined) {
      conditions.push("a.category_id = @categoryId");
      params.categoryId = filters.categoryId;
    }

    if (filters?.speciesId !== undefined) {
      conditions.push("a.species_id = @speciesId");
      params.speciesId = filters.speciesId;
    }

    if (filters?.q !== undefined && filters.q.trim() !== "") {
      const searchTerm = `%${filters.q.trim()}%`;
      conditions.push(
        "(a.name COLLATE NOCASE LIKE @searchTerm OR a.breed COLLATE NOCASE LIKE @searchTerm)"
      );
      params.searchTerm = searchTerm;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT
        a.id,
        a.name,
        a.breed,
        a.age,
        a.gender,
        a.size,
        a.status,
        a.description,
        a.image_url as imageUrl,
        a.created_at as created_at,
        c.name as category_name,
        s.name as species_name
      FROM animals a
      JOIN categories c ON a.category_id = c.id
      JOIN species s ON a.species_id = s.id
      ${whereClause}
      ORDER BY a.created_at DESC
    `;

    const rows = db.prepare(query).all(params) as AnimalRow[];

    return rows.map(mapRowToAnimal);
  }

  findById(id: number): AnimalWithRelations | null {
    const query = `
      SELECT
        a.id,
        a.name,
        a.breed,
        a.age,
        a.gender,
        a.size,
        a.status,
        a.description,
        a.image_url as imageUrl,
        a.created_at as created_at,
        c.name as category_name,
        s.name as species_name
      FROM animals a
      JOIN categories c ON a.category_id = c.id
      JOIN species s ON a.species_id = s.id
      WHERE a.id = @id
    `;

    const row = db.prepare(query).get({ id }) as AnimalRow | undefined;

    if (!row) {
      return null;
    }

    return mapRowToAnimal(row);
  }

  create(data: {
    name: string;
    breed: string;
    age: number | null;
    gender: "Мальчик" | "Девочка" | "Неизвестно";
    size: "Маленький" | "Средний" | "Большой";
    status: "Доступно" | "Зарезервировано" | "Пристроено";
    description: string | null;
    imageUrl: string | null;
    categoryId: number;
    speciesId: number;
    createdAt: string;
  }): number {
    const query = `
      INSERT INTO animals (name, breed, age, gender, size, status, description, image_url, category_id, species_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = db.prepare(query).run(
      data.name,
      data.breed,
      data.age || null,
      data.gender,
      data.size,
      data.status,
      data.description || null,
      data.imageUrl || null,
      data.categoryId,
      data.speciesId,
      data.createdAt
    );

    return result.lastInsertRowid as number;
  }

  findCategoryByName(name: string) {
    const query = "SELECT id, name FROM categories WHERE name = ? LIMIT 1";
    return db.prepare(query).get(name) as { id: number; name: string } | undefined;
  }

  findSpeciesByNameAndCategory(name: string, categoryId: number) {
    const query = "SELECT id, name, category_id FROM species WHERE name = ? AND category_id = ? LIMIT 1";
    return db.prepare(query).get(name, categoryId) as { id: number; name: string; category_id: number } | undefined;
  }
}

export const animalRepository = new AnimalRepository();
