import { api } from "@/api";
import { AnimalsSectionClient } from "./AnimalsSectionClient";

export async function AnimalsSection() {
  const { animals, total } = await api.animals.getAll();

  return <AnimalsSectionClient allAnimals={animals} total={total} />;
}
