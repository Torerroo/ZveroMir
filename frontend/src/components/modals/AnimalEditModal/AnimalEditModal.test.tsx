import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { api } from "@/api";
import { appToast } from "../../ui/AppToast";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { AnimalEditModal } from "./AnimalEditModal";

jest.mock("@/api");
jest.mock("../../ui/AppToast");
jest.mock("@/stores/auth/useAuthStore");

jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      layout,
      initial,
      animate,
      exit,
      whileHover,
      whileTap,
      transition,
      ...props
    }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  LayoutGroup: ({ children }: any) => <>{children}</>,
}));

const mockAnimal = {
  id: 1,
  name: "Рекс",
  category: "dogs",
  species: "Собака",
  breed: "Овчарка",
  age: 5,
  gender: "Мальчик",
  size: "Большой",
  description: "Хороший мальчик",
  images: [{ id: 101, url: "/test-image.jpg" }],
} as any;

describe("AnimalEditModal", () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ isAuth: true });
  });

  test("кнопка редактирования заблокирована, если нет авторизации", () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ isAuth: false });
    render(<AnimalEditModal animal={mockAnimal} onUpdate={mockOnUpdate} />);

    const editBtn = screen.getByRole("button", { name: /редактировать/i });
    expect(editBtn).toBeDisabled();
  });

  test("модалка открывается и предзаполняет форму данными", async () => {
    render(<AnimalEditModal animal={mockAnimal} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByRole("button", { name: /редактировать/i }));

    expect(screen.getByText("Редактирование")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Рекс")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Овчарка")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Хороший мальчик")).toBeInTheDocument();
  });

  test("успешно отправляет форму и вызывает onUpdate", async () => {
    const updatedAnimal = { ...mockAnimal, name: "Рекс Обновленный" };
    (api.animals.update as jest.Mock).mockResolvedValue(updatedAnimal);

    render(<AnimalEditModal animal={mockAnimal} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByRole("button", { name: /редактировать/i }));

    const nameInput = screen.getByDisplayValue("Рекс");
    fireEvent.change(nameInput, { target: { value: "Рекс Обновленный" } });

    const submitBtn = screen.getByRole("button", {
      name: /сохранить изменения/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.animals.update).toHaveBeenCalledWith(
        "1",
        expect.any(FormData),
      );

      expect(mockOnUpdate).toHaveBeenCalledWith(updatedAnimal);
      expect(appToast.success).toHaveBeenCalled();
    });
  });

  test("обрабатывает ошибку при сохранении", async () => {
    (api.animals.update as jest.Mock).mockRejectedValue(
      new Error("Ошибка сервера"),
    );

    render(<AnimalEditModal animal={mockAnimal} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByRole("button", { name: /редактировать/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /сохранить изменения/i }),
    );

    await waitFor(() => {
      expect(appToast.error).toHaveBeenCalledWith("Ошибка сервера");
    });
  });
});
