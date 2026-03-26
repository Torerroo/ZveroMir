import { authService } from "./authService";
import { userRepository } from "../repositories/userRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../repositories/userRepository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  const mockDate = "2026-03-17";

  const mockUserFromDb = {
    id: 1,
    email: "test@example.com",
    fullName: "Test User",
    createdAt: new Date(mockDate),
    passwordHash: "hashed_password_123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
  });

  describe("login", () => {
    const loginData = { email: "test@example.com", password: "password123" };

    test("Успешный вход", async () => {
      (userRepository.findByEmail as any).mockReturnValue(mockUserFromDb);
      (bcrypt.compare as any).mockResolvedValue(true);
      (jwt.sign as any).mockReturnValue("fake_token");

      const result = await authService.login(loginData);

      expect(result.token).toBe("fake_token");
      expect(result.user.fullName).toBe(mockUserFromDb.fullName);
    });

    test("Ошибка: пользователь не найден", async () => {
      (userRepository.findByEmail as any).mockReturnValue(null);

      await expect(authService.login(loginData)).rejects.toMatchObject({
        message: "Неверный email или пароль",
        statusCode: 401,
      });
    });

    test("Ошибка: неверный пароль", async () => {
      (userRepository.findByEmail as any).mockReturnValue(mockUserFromDb);
      (bcrypt.compare as any).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toMatchObject({
        message: "Неверный email или пароль",
        statusCode: 401,
      });
    });
  });

  describe("register", () => {
    const registerData = {
      email: "new@test.com",
      password: "password",
      fullName: "New User",
    };

    test("Успешная регистрация", async () => {
      (userRepository.findByEmail as any).mockReturnValue(null);
      (bcrypt.genSalt as any).mockResolvedValue("salt");
      (bcrypt.hash as any).mockResolvedValue("hashed");
      (userRepository.create as any).mockReturnValue(mockUserFromDb);
      (jwt.sign as any).mockReturnValue("fake_token");

      const result = await authService.register(registerData);

      expect(result.token).toBe("fake_token");
      expect(userRepository.create).toHaveBeenCalled();
    });

    test("Ошибка: email занят", async () => {
      (userRepository.findByEmail as any).mockReturnValue(mockUserFromDb);

      await expect(authService.register(registerData)).rejects.toMatchObject({
        message: "Пользователь с таким email уже существует",
        statusCode: 401,
      });
    });
  });

  describe("getMe", () => {
    test("Возвращает пользователя, если найден", async () => {
      (userRepository.findById as any).mockReturnValue(mockUserFromDb);

      const result = await authService.getMe(1);
      expect(result.id).toBe(1);
    });

    test("Ошибка: пользователь не найден", async () => {
      (userRepository.findById as any).mockReturnValue(null);

      try {
        await authService.getMe(999);
      } catch (e) {
        expect(e).toMatchObject({
          message: "Пользователь не найден",
          statusCode: 401,
        });
      }
    });
  });
});
