import { api } from "@/api";
import type { AnimalWithRelations } from "@/types/animals";
import { AnimalCard } from "./AnimalCard";

export async function AnimalsSection() {
  const { animals, total } = await api.animals.getAll();

  return (
    <section
      className="min-h-screen w-full"
      style={{
        backgroundImage: `linear-gradient(to bottom,
          #fffef9 0%,
          #fcf9f3 18%,
          #f8f4ec 35%,
          #f2ebe0 52%,
          #ebe3d8 70%,
          #e5dccf 88%,
          #e0d6c8 100%
        )`,
      }}
      aria-label="Наши питомцы"
    >
      <div className="mx-auto w-full px-30 pb-18 pt-16">
        <h2 className="text-center text-4xl font-semibold tracking-tight text-amber-900/80 sm:text-5xl">
          Наши питомцы
        </h2>

        <div className="mt-12 grid gap-8 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
          {animals.map((animal: AnimalWithRelations) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      </div>
    </section>
  );
}
