import express from "express";
import dotenv from "dotenv";
import { sqliteConnection } from "./database/client";
import { initDatabase } from "./database/init";

dotenv.config({
  debug: false,
  override: false,
  quiet: true,
});

const app = express();
const PORT = process.env.PORT;

const start = async () => {
  try {
    const connected = await sqliteConnection();
    if (!connected) {
      throw new Error("Не удалось подключиться к БД");
    }

    await initDatabase();

    app.listen(PORT, () => {
      console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска сервера:", error);
  }
};

start();
