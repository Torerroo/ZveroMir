import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { LoginData, RegisterData } from "../validators/authValidation.schema";
import { unauthorizedError } from "../utils/errors";
import { User } from "../types/userType";

class AuthService {
  async login(data: LoginData): Promise<{ user: User; token: string }> {
    const existing = await userRepository.findByEmail(data.email);

    if (!existing) {
      throw unauthorizedError("Неверный email или пароль");
    }

    const isValid = await bcrypt.compare(
      data.password,
      existing.passwordHash,
    );

    if (!isValid) {
      throw unauthorizedError("Неверный email или пароль");
    }

    const user = {
      id: existing.id,
      email: existing.email,
      fullName: existing.fullName,
      createdAt: existing.createdAt.toISOString(),
    };

    const token = this.signToken(user.id);

    return { user, token };
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw unauthorizedError("Пользователь с таким email уже существует");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await userRepository.create({
      email: data.email,
      passwordHash,
      fullName: data.fullName ?? null,
    });

    const token = this.signToken(user.id);

    return { user, token };
  }

  async getMe(userId: number): Promise<User> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw unauthorizedError("Пользователь не найден");
    }
    return user;
  }

  private signToken(userId: number): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET не настроен");
    }

    return jwt.sign({ userId }, secret, { expiresIn: "7d" });
  }
}

export const authService = new AuthService();

