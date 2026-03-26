import { prisma } from "../prisma";
import { User, UserRow } from "../types/userType";

function mapRowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName,
    createdAt: row.createdAt.toISOString(),
  };
}

class UserRepository {
  async findByEmail(email: string): Promise<UserRow | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        fullName: true,
        createdAt: true,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    const row: UserRow | null = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        fullName: true,
        createdAt: true,
      },
    });
    if (!row) {
      return null;
    }
    return mapRowToUser(row);
  }

  async create(data: {
    email: string;
    passwordHash: string;
    fullName?: string | null;
  }): Promise<User> {
    const createdRow: UserRow | null = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        fullName: data.fullName ?? null,
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        fullName: true,
        createdAt: true,
      },
    });

    if (!createdRow) {
      throw new Error("Не удалось получить созданного пользователя");
    }

    return mapRowToUser(createdRow);
  }
}

export const userRepository = new UserRepository();

