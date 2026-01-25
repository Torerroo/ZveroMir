import express from "express";
import dotenv from "dotenv";

dotenv.config({
  debug: false,
  override: false,
  quiet: true,
});

const app = express();
const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска сервера:", error);
  }
};

start();
