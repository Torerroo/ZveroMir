import { db } from "../db";
import { User, UserRow } from "../types/userType";

function mapRowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    createdAt: row.created_at,
  };
}

class UserRepository {
  findByEmail(email: string): (UserRow & { password_hash: string }) | null {
    const query = `
      SELECT id, email, password_hash, full_name, created_at
      FROM users
      WHERE email = ?
      LIMIT 1
    `;

    const row = db.prepare(query).get(email) as UserRow | undefined;
    return row ?? null;
  }

  findById(id: number): User | null {
    const query = `
      SELECT id, email, password_hash, full_name, created_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `;

    const row = db.prepare(query).get(id) as UserRow | undefined;
    if (!row) {
      return null;
    }
    return mapRowToUser(row);
  }

  create(data: { email: string; passwordHash: string; fullName?: string | null }): User {
    const query = `
      INSERT INTO users (email, password_hash, full_name)
      VALUES (?, ?, ?)
    `;

    const result = db
      .prepare(query)
      .run(data.email, data.passwordHash, data.fullName ?? null);

    const id = result.lastInsertRowid as number;

    const createdRow = db
      .prepare(
        "SELECT id, email, password_hash, full_name, created_at FROM users WHERE id = ?"
      )
      .get(id) as UserRow | undefined;

    if (!createdRow) {
      throw new Error("Не удалось получить созданного пользователя");
    }

    return mapRowToUser(createdRow);
  }
}

export const userRepository = new UserRepository();

