import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import apiRouter from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import path from "path";
import { connectPrisma } from "./prisma";

dotenv.config({
  debug: false,
  override: false,
  quiet: true,
});

const app = express();
const PORT = process.env.PORT;

const ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:3001"];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/static", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", apiRouter);

app.use(errorHandler);

export { app };

const start = async () => {
  try {
    const connected = await connectPrisma();
    if (!connected) {
      throw new Error("Не удалось подключиться к БД");
    }

    app.listen(PORT, () => {
      console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска сервера:", error);
  }
};

if (require.main === module) {
  start();
}
