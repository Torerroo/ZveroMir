import { db } from "../db";
import { AnimalRow, AnimalWithRelations } from "../types/animalType";

class AnimalModel {
  findAll(filters?: {
    categoryId?: number | undefined;
    speciesId?: number | undefined;
  }): AnimalWithRelations[] {
    const conditions: string[] = [];
    const params: Record<string, number> = {};

    if (filters?.categoryId !== undefined) {
      conditions.push("a.category_id = @categoryId");
      params.categoryId = filters.categoryId;
    }

    if (filters?.speciesId !== undefined) {
      conditions.push("a.species_id = @speciesId");
      params.speciesId = filters.speciesId;
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

    return rows.map(
      (row): AnimalWithRelations => ({
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
      })
    );
  }
}

export const animalModel = new AnimalModel();
