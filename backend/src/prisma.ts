import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL не задан в .env");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma = new PrismaClient({ adapter });

export async function connectPrisma(): Promise<boolean> {
  try {
    await prisma.$connect();

    const count = await prisma.animal.count();
    console.log(`✅ Prisma (Postgres) подключена. Животных в базе: ${count}`);
    return true;
  } catch (error) {
    console.error("❌ Ошибка при подключении Prisma:", error);
    return false;
  }
}
