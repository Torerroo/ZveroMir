import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB, runMigrations, seedData } from "./db";
import apiRouter from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth";

dotenv.config({
  debug: false,
  override: false,
  quiet: true,
});

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(authMiddleware);

app.use("/api", apiRouter);

app.use(errorHandler);

const start = async () => {
  try {
    const connected = await connectDB();
    if (!connected) {
      throw new Error("Не удалось подключиться к БД");
    }

    await runMigrations();
    await seedData();

    app.listen(PORT, () => {
      console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска сервера:", error);
  }
};

start();
