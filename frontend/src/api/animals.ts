export type Animal = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

// Сейчас — захардкоженные данные. Позже замените на fetch к вашему API.
const FAKE_ANIMALS: Animal[] = [
  {
    id: "barny",
    name: "Барни",
    description: "Верный друг, любит прогулки",
    imageUrl: "",
  },
  {
    id: "murka",
    name: "Мурка",
    description: "Ласковая и игривая",
    imageUrl: "",
  },
  {
    id: "archie",
    name: "Арчи",
    description: "Ласковая и игривая",
    imageUrl: "",
  },
  {
    id: "fluffy",
    name: "Пушистик",
    description: "Верный друг, любит прогулки",
    imageUrl: "",
  },
  {
    id: "umka",
    name: "Умка",
    description: "Ласковая и игривая",
    imageUrl: "",
  },
  {
    id: "leo",
    name: "Лео",
    description: "Ласковая и игривая",
    imageUrl: "",
  },
  {
    id: "umka2",
    name: "Умка",
    description: "Ласковая и игривая",
    imageUrl: "",
  },
  {
    id: "leo2",
    name: "Лео",
    description: "Ласковая и игривая",
    imageUrl: "",
  },
  {
    id: "umka3",
    name: "Умка",
    description: "Ласковая и игривая",
    imageUrl: "",
  },
  {
    id: "leo3",
    name: "Лео",
    description: "Ласковая и игривая",
    imageUrl: "",
  },
];

export async function getAnimals(): Promise<Animal[]> {
  return FAKE_ANIMALS;
}

export async function getAnimalById(id: string): Promise<Animal | undefined> {
  return FAKE_ANIMALS.find((a) => a.id === id);
}
