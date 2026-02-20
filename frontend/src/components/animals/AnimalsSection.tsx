import { api } from "@/api";
import { AnimalsSectionClient } from "./AnimalsSectionClient";

export async function AnimalsSection() {
  const [animalsData, species] = await Promise.all([
    api.animals.getAll(),
    api.animals.getSpecies(),
  ]);

  return (
    <AnimalsSectionClient
      initialAnimals={animalsData.animals}
      initialTotal={animalsData.total}
      species={species}
    />
  );
}
