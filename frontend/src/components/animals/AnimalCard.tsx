import Link from "next/link";
import Image from "next/image";

import type { AnimalWithRelations } from "@/types/animals";

type Props = {
  animal: AnimalWithRelations;
};

export function AnimalCard({ animal }: Props) {
  const mainImageUrl =
    animal.images.find((img) => img.isMain)?.url || animal.images[0]?.url;

  const speciesIcon =
    animal.species === "Кот"
      ? "😺"
      : animal.species === "Собака"
      ? "🐶"
      : animal.species === "Попугай"
      ? "🦜"
      : animal.species === "Черепаха"
      ? "🐢"
      : animal.species === "Игуана"
      ? "🦎"
      : animal.species === "Лемур"
      ? "🐒"
      : animal.species === "Змея"
      ? "🐍"
      : "🐾";

  const ageText =
    animal.age !== null && animal.age !== undefined
      ? `${animal.age} ${
          animal.age === 1 ? "год" : animal.age < 5 ? "года" : "лет"
        }`
      : "возраст неизвестен";

  const genderColor =
    animal.gender === "Мальчик"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-pink-100 text-pink-700 border-pink-200";

  const sizeColor =
    animal.size === "Маленький"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : animal.size === "Средний"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-orange-100 text-orange-700 border-orange-200";

  return (
    <Link
      href={`/animals/${animal.id}`}
      aria-label={`Открыть: ${animal.name}`}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white/30"
    >
      <article className="overflow-hidden rounded-3xl bg-white/65 ring-1 ring-black/5 backdrop-blur transition-all duration-300 will-change-transform hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.16)] shadow-[0_10px_30px_rgba(0,0,0,0.10)] h-full flex flex-col">
        <div className="relative aspect-4/3 w-full overflow-hidden">
          {mainImageUrl && (
            <Image
              src={mainImageUrl}
              alt={animal.name}
              fill
              unoptimized
              className="object-cover object-[center_20%] transition duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent opacity-90 transition group-hover:opacity-100" />
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-2xl font-semibold tracking-tight text-neutral-900">
              {animal.name}
            </h3>
            <span
              className="text-2xl"
              role="img"
              aria-label={animal.species || "животное"}
            >
              {speciesIcon}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`text-sm px-3 py-1.5 rounded-full border ${genderColor} font-medium`}
            >
              {animal.gender}
            </span>

            <span
              className={`text-sm px-3 py-1.5 rounded-full border ${sizeColor} font-medium`}
            >
              {animal.size}
            </span>

            <span className="text-sm px-3 py-1.5 rounded-full border bg-gray-100 text-gray-700 border-gray-200 font-medium">
              {ageText}
            </span>
          </div>

          <p
            className="text-base leading-relaxed text-neutral-700 line-clamp-2"
            title={animal.description || ""}
          >
            {animal.description || "Нет описания"}
          </p>
        </div>
      </article>
    </Link>
  );
}
