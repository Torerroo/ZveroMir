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

  // 1. Создаем техническую таблицу ПЕРЕД всем остальным
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    const migrationsDir = path.join(process.cwd(), "sql", "migrations");
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files.filter((file) => file.endsWith(".sql")).sort();

    const appliedMigrations = db
      .prepare("SELECT name FROM migrations")
      .all() as { name: string }[];
    const appliedNames = new Set(appliedMigrations.map((m) => m.name));

    for (const file of migrationFiles) {
      const migrationName = file.replace(".sql", "");

      if (!appliedNames.has(migrationName)) {
        console.log(`📦 Применяем миграцию: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = await fs.readFile(filePath, "utf8");

        // Используем транзакцию, чтобы миграция и запись о ней были атомарны
        const applyMigration = db.transaction(
          (content: string, name: string) => {
            db.exec(content);
            db.prepare("INSERT INTO migrations (name) VALUES (?)").run(name);
          }
        );

        applyMigration(sql, migrationName);
        console.log(`✅ Миграция ${file} успешно применена`);
      } else {
        console.log(`⏭️ Миграция ${file} уже применена`);
      }
    }

    console.log("✅ Все миграции проверены");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Ошибка миграций:", message);
    throw error; // Блокируем запуск сервера, если миграции битые
  }
}

export async function seedData(): Promise<void> {
  // Проверяем окружение
  if (process.env.NODE_ENV !== "DEV") {
    console.log("⏭️ Сиды пропущены (не DEV окружение)");
    return;
  }

  try {
    // Проверка на наличие данных, чтобы не дублировать
    const existing = db
      .prepare("SELECT COUNT(*) as count FROM animals")
      .get() as { count: number };
    if (existing.count > 0) {
      console.log("⏭️ Тестовые данные уже в базе");
      return;
    }

    console.log("🌱 Наполнение базы тестовыми данными...");
    const seedPath = path.join(process.cwd(), "sql", "seeds", "dev_seed.sql");
    const sql = await fs.readFile(seedPath, "utf8");

    // Выполняем seed целиком
    db.exec(sql);
    console.log("✅ Тестовые данные успешно загружены");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Ошибка сидов:", message);
    // Сиды не критичны для работы сервера, поэтому не выбрасываем throw, если не хотим
  }
}
