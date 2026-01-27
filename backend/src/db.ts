import Database, { Database as DatabaseType } from "better-sqlite3";
import fs from "fs/promises";
import path from "path";

const dbPath = path.resolve(process.cwd(), "zveromir.db");
export const db: DatabaseType = new Database(dbPath);

export async function connectDB(): Promise<boolean> {
  try {
    const result = db.prepare("SELECT CURRENT_TIMESTAMP as now").get() as {
      now: string;
    };
    console.log(`✅ Подключение к SQLite: ${result.now}`);
    return true;
  } catch (error) {
    console.error("❌ Ошибка SQLite:", error);
    return false;
  }
}

export async function runMigrations(): Promise<void> {
  console.log("🔍 Проверяем миграции...");

  try {
    // Читаем список миграций из папки
    const migrationsDir = path.join(process.cwd(), "sql", "migrations");
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files.filter((file) => file.endsWith(".sql")).sort();

    // Получаем уже применённые миграции
    let appliedNames = new Set<string>();
    try {
      const appliedMigrations = db
        .prepare("SELECT name FROM migrations")
        .all() as { name: string }[];
      appliedNames = new Set(appliedMigrations.map((m) => m.name));
    } catch {
      // Таблица migrations ещё не создана
    }

    // Применяем только новые миграции
    for (const file of migrationFiles) {
      const migrationName = file.replace(".sql", "");
      if (!appliedNames.has(migrationName)) {
        console.log(`📦 Применяем миграцию: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = await fs.readFile(filePath, "utf8");

        db.exec(sql);

        // Фиксируем применение
        db.prepare("INSERT INTO migrations (name) VALUES (?)").run(
          migrationName
        );

        console.log(`✅ Миграция ${file} применена`);
      } else {
        console.log(`⏭️ Миграция ${file} уже применена`);
      }
    }

    console.log("✅ Все миграции проверены");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Ошибка миграций:", error.message);
    } else {
      console.error("❌ Неизвестная ошибка:", error);
    }
    throw error;
  }
}

export async function seedData(): Promise<void> {
  if (process.env.NODE_ENV !== "DEV") {
    console.log("⏭️ Сиды пропущены (не DEV окружение)");
    return;
  }

  console.log("🌱 Добавляем тестовые данные...");

  try {
    // Проверяем, есть ли уже данные в animals
    const existingAnimals = db
      .prepare("SELECT COUNT(*) as count FROM animals")
      .get() as { count: number };
    if (existingAnimals.count > 0) {
      console.log("⏭️ Тестовые данные уже добавлены");
      return;
    }

    const seedPath = path.join(process.cwd(), "sql", "seeds", "dev_seed.sql");
    const sql = await fs.readFile(seedPath, "utf8");

    db.exec(sql);

    console.log("✅ Тестовые данные добавлены");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Ошибка сидов:", error.message);
    } else {
      console.error("❌ Неизвестная ошибка:", error);
    }
    throw error;
  }
}
