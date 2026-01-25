import fs from "fs/promises";
import path from "path";
import { db } from "./client";

type TableExistsResult = {
  name: string;
};

export async function initDatabase(): Promise<void> {
  console.log("🔍 Проверяем базу данных...");

  try {
    const tableExists = db
      .prepare(
        `
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='animals'
    `
      )
      .get() as TableExistsResult | undefined;

    if (!tableExists) {
      console.log("📦 Создаем таблицы...");

      const schemaPath = path.join(process.cwd(), "sql", "schema.sql");
      const schemaSQL = await fs.readFile(schemaPath, "utf8");

      const statements = schemaSQL.split(";").filter((stmt) => stmt.trim());
      for (const stmt of statements) {
        db.prepare(stmt).run();
      }

      console.log("✅ Таблицы созданы");

      console.log("🌱 Добавляем тестовые данные...");
      const seedPath = path.join(process.cwd(), "sql", "seed.sql");
      const seedSQL = await fs.readFile(seedPath, "utf8");

      const seedStatements = seedSQL.split(";").filter((stmt) => stmt.trim());
      for (const stmt of seedStatements) {
        db.prepare(stmt).run();
      }

      console.log("✅ Тестовые данные добавлены");
    } else {
      console.log("✓ База данных уже инициализирована");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Ошибка инициализации БД:", error.message);
    } else {
      console.error("❌ Неизвестная ошибка:", error);
    }
    throw error;
  }
}
