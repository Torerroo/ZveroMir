import Database, { Database as DatabaseType } from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "zveromir.db");

export const db: DatabaseType = new Database(dbPath);

db.pragma("foreign_keys = ON");

type QueryResult = {
  now: string;
};

export async function sqliteConnection(): Promise<boolean> {
  try {
    const result = db
      .prepare("SELECT CURRENT_TIMESTAMP as now")
      .get() as QueryResult;
    console.log(`✅ Подключение к SQLite: ${result.now}`);
    return true;
  } catch (error) {
    console.error("❌ Ошибка SQLite:", error);
    return false;
  }
}
