import Link from "next/link";

import { api } from "@/api";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AnimalPage({ params }: Props) {
  const { id } = await params;
  const animal = await api.animals.getById(id);

  return (
    <main className="min-h-screen bg-linear-to-b from-[#fffef9] via-[#f5efe5] to-[#e0d6c8]">
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <div className="rounded-2xl bg-white/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.10)] ring-1 ring-black/5 backdrop-blur">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {animal?.name ?? "Страница животного"}
          </h1>

          {animal && (
            <>
              <p className="mt-3 text-neutral-800">
                Категория:{" "}
                <span className="font-semibold">{animal.category}</span>
              </p>
              <p className="mt-1 text-neutral-800">
                Вид: <span className="font-semibold">{animal.species}</span>
              </p>
              <p className="mt-1 text-neutral-800">
                Пол: <span className="font-semibold">{animal.gender}</span>
              </p>
              <p className="mt-1 text-neutral-800">
                Размер: <span className="font-semibold">{animal.size}</span>
              </p>
              <p className="mt-1 text-neutral-800">
                Статус: <span className="font-semibold">{animal.status}</span>
              </p>

              {animal.description && (
                <p className="mt-4 text-neutral-800">{animal.description}</p>
              )}
            </>
          )}

          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-amber-900/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-900"
          >
            ← На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
