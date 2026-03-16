import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthModal } from "./AuthModal";
import { useAuthStore } from "@/stores/auth/useAuthStore";

jest.mock("@/stores/auth/useAuthStore");

jest.mock("framer-motion", () => {
  const motionMock =
    (Tag: string) =>
    ({
      children,
      layout,
      initial,
      animate,
      exit,
      transition,
      whileHover,
      whileTap,
      viewport,
      ...props
    }: any) => <Tag {...props}>{children}</Tag>;

  return {
    motion: {
      div: motionMock("div"),
      p: motionMock("p"),
      h2: motionMock("h2"),
      button: motionMock("button"),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    LayoutGroup: ({ children }: any) => <>{children}</>,
  };
});

describe("AuthModal", () => {
  const mockLogin = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockLogin);
  });

  test("не отображается, если isOpen = false", () => {
    render(<AuthModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText(/Войти в профиль/i)).not.toBeInTheDocument();
  });

  test("закрывается при нажатии клавиши Escape", () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("успешная авторизация вызывает login и закрывает модалку", async () => {
    mockLogin.mockResolvedValueOnce({});

    render(<AuthModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Пароль/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Продолжить/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("отображает ошибку, если сервер вернул JSON с сообщением", async () => {
    const customError: any = new Error(
      JSON.stringify({
        error: { message: "Неверный логин или пароль" },
      }),
    );
    customError.error = { message: "Неверный логин или пароль" };

    mockLogin.mockRejectedValueOnce(customError);

    render(<AuthModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Пароль/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Продолжить/i }));

    await waitFor(
      () => {
        expect(
          screen.getByText("Неверный логин или пароль"),
        ).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  test("сбрасывает форму при закрытии", () => {
    const { rerender } = render(
      <AuthModal isOpen={true} onClose={mockOnClose} />,
    );

    const emailInput = screen.getByPlaceholderText(
      /Email/i,
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "dirty@data.com" } });
    expect(emailInput.value).toBe("dirty@data.com");

    rerender(<AuthModal isOpen={false} onClose={mockOnClose} />);

    rerender(<AuthModal isOpen={true} onClose={mockOnClose} />);

    expect(emailInput.value).toBe("");
  });
});
