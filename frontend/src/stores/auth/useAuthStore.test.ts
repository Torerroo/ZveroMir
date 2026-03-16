/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "./useAuthStore";
import { api } from "@/api";
import { appToast } from "@/components/ui/AppToast";

jest.mock("@/api");
jest.mock("@/components/ui/AppToast");

describe("useAuthStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      isAuth: false,
      isLoading: false,
    });
  });

  test("Успешный логин", async () => {
    const mockUser = { id: "1", fullName: "Иван Иванов" };
    (api.auth.login as jest.Mock).mockResolvedValue({ user: mockUser });

    await useAuthStore.getState().login({
      email: "test@test.com",
      password: "123",
    });

    const state = useAuthStore.getState();

    expect(state.isAuth).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(appToast.success).toHaveBeenCalledWith(
      "Рады видеть вас, Иван Иванов!",
    );
  });

  test("Ошибка при логине", async () => {
    (api.auth.login as jest.Mock).mockRejectedValue(new Error("Unauthorized"));

    await expect(
      useAuthStore.getState().login({
        email: "wrong@test.com",
        password: "123",
      }),
    ).rejects.toThrow();

    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
    expect(appToast.error).toHaveBeenCalledWith("Не удалось войти");
  });

  test("Успешный логаут", async () => {
    useAuthStore.setState({
      isAuth: true,
      user: { id: "1", fullName: "User" } as any,
    });

    (api.auth.logout as jest.Mock).mockResolvedValue({});

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();

    expect(state.isAuth).toBe(false);
    expect(state.user).toBeNull();
    expect(appToast.success).toHaveBeenCalledWith(
      "До встречи! Возвращайтесь в ЗвероМир.",
    );
  });
});
