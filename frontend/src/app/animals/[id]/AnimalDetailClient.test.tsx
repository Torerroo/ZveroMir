import { render, screen, fireEvent } from "@testing-library/react";
import { AnimalDetailClient } from "./AnimalDetailClient";
import { appToast } from "@/components/ui/AppToast";

jest.mock("@/components/ui/AppToast");
jest.mock("@/components/maps/LocationMap", () => ({
  LocationMap: ({ onAddressSelect }: any) => (
    <button onClick={() => onAddressSelect("ул. Пушкина, дом Колотушкина")}>
      Выбрать адрес
    </button>
  ),
}));
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      whileInView,
      viewport,
      initial,
      animate,
      transition,
      whileHover,
      whileTap,
      ...props
    }: any) => <div {...props}>{children}</div>,
    section: ({
      children,
      whileInView,
      viewport,
      initial,
      animate,
      transition,
      ...props
    }: any) => <section {...props}>{children}</section>,
    h1: ({
      children,
      whileInView,
      viewport,
      initial,
      animate,
      transition,
      ...props
    }: any) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockAnimal = {
  id: "1",
  name: "Рекс",
  species: "Собака",
  breed: "Овчарка",
  gender: "Мальчик",
  size: "Большой",
  age: 5,
  description: "Верный друг",
  images: [],
} as any;

describe("AnimalDetailClient", () => {
  test("правильно отображает данные питомца и логику склонения возраста", () => {
    render(<AnimalDetailClient animal={mockAnimal} />);

    expect(screen.getByText("Рекс")).toBeInTheDocument();
    expect(screen.getByText("Овчарка")).toBeInTheDocument();
    expect(screen.getByText("5 лет")).toBeInTheDocument();
  });

  test("показывает форму заявки только после выбора адреса на карте", () => {
    render(<AnimalDetailClient animal={mockAnimal} />);

    expect(screen.queryByText(/Пункт встречи выбран/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Выбрать адрес"));

    expect(
      screen.getByText("ул. Пушкина, дом Колотушкина"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Отправить заявку/i }),
    ).toBeInTheDocument();
  });

  test("вызывает тост при успешной отправке заявки", () => {
    render(<AnimalDetailClient animal={mockAnimal} />);

    fireEvent.click(screen.getByText("Выбрать адрес"));

    fireEvent.click(screen.getByRole("button", { name: /Отправить заявку/i }));

    expect(appToast.success).toHaveBeenCalledWith(
      expect.stringContaining("Заявка отправлена"),
    );
  });
});
