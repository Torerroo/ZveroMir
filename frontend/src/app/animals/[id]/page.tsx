import Link from "next/link";

import { api } from "@/api";
import { AnimalGallery } from "@/components/animals/AnimalGallery";
import { AnimalEditModal } from "@/components/modals/AnimalEditModal";
import type { AnimalWithRelations } from "@/types/animals";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AnimalPage({ params }: Props) {
  const { id } = await params;
  const animal = (await api.animals.getById(id)) as AnimalWithRelations | null;

  const ageText =
    animal?.age !== null && animal?.age !== undefined
      ? `${animal.age} ${
          animal.age === 1 ? "год" : animal.age < 5 ? "года" : "лет"
        }`
      : "возраст неизвестен";

  const genderColor =
    animal?.gender === "Мальчик"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-pink-100 text-pink-700 border-pink-200";

  const sizeColor =
    animal?.size === "Маленький"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : animal?.size === "Средний"
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-orange-100 text-orange-700 border-orange-200";

  if (!animal) {
    return (
      <main className="min-h-screen bg-linear-to-b from-[#fffef9] via-[#f5efe5] to-[#e0d6c8]">
        <div className="mx-auto w-full max-w-3xl px-4 py-14">
          <div className="rounded-2xl bg-white/70 p-8 text-center shadow-[0_12px_32px_rgba(0,0,0,0.12)] ring-1 ring-black/5 backdrop-blur">
            <h1 className="text-2xl font-semibold text-neutral-900">
              Животное не найдено
            </h1>
            <p className="mt-3 text-neutral-700">
              Возможно, питомец был удалён или ссылка устарела.
            </p>
            <Link
              href="/#animals-section"
              className="mt-6 inline-flex rounded-lg bg-amber-900/90 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-900"
            >
              ← Вернуться к питомцам
            </Link>
          </div>
        </div>
      </main>
    );
  }

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

  return (
    <main className="min-h-screen bg-linear-to-b from-[#fffef9] via-[#f5efe5] to-[#e0d6c8]">
      <div className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-4 sm:py-8 md:py-10 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-3 md:mb-8">
          <Link
            href="/#animals-section"
            className="inline-flex items-center gap-2 rounded-full border border-amber-900/30 bg-amber-900/5 px-4 py-2 text-sm font-semibold leading-none text-amber-900 shadow-sm transition hover:bg-amber-900/10"
          >
            <span className="text-base leading-none">←</span>
            <span>Назад к питомцам</span>
          </Link>

          <AnimalEditModal animal={animal} />
        </div>

        <section className="space-y-6 rounded-3xl bg-white/80 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.16)] ring-1 ring-black/5 md:p-6 lg:p-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2.4fr)] lg:items-start">
            <div className="space-y-4 md:space-y-6">
              <AnimalGallery name={animal.name} images={animal.images} />
            </div>

            <aside className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
                    {animal.name}
                  </h1>
                  <span className="text-2xl md:text-3xl">{speciesIcon}</span>
                </div>

                <p className="text-sm text-neutral-600 md:text-base">
                  {animal.breed || animal.species}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`text-xs px-3 py-1.5 rounded-full border ${genderColor} font-medium md:text-sm`}
                >
                  {animal.gender}
                </span>

                <span
                  className={`text-xs px-3 py-1.5 rounded-full border ${sizeColor} font-medium md:text-sm`}
                >
                  {animal.size}
                </span>

                <span className="text-xs px-3 py-1.5 rounded-full border bg-gray-100 text-gray-700 border-gray-200 font-medium md:text-sm">
                  {ageText}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  Описание
                </h2>
                <p className="rounded-2xl bg-neutral-50/80 p-4 text-sm leading-relaxed text-neutral-800 md:text-base">
                  {animal.description ||
                    "Пока для этого питомца нет подробного описания, но вы можете узнать о нём больше, связавшись с приютом."}
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-2 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/80 px-4 py-3 text-xs leading-relaxed text-neutral-600 md:text-sm">
            Здесь позже можно будет добавить карту Яндекс с выбором адреса и
            оформлением доставки питомца. Блок уже вписан в композицию страницы.
          </div>
        </section>
      </div>
    </main>
  );
}
