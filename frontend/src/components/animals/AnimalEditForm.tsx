 "use client";

import { useCallback } from "react";

import type { AnimalWithRelations, AnimalSize, Gender } from "@/types/animals";

type Props = {
  animal: AnimalWithRelations;
};

export function AnimalEditForm({ animal }: Props) {
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);

      const entries: Record<string, unknown> = {};
      formData.forEach((value, key) => {
        if (entries[key] !== undefined) {
          const existing = entries[key];
          if (Array.isArray(existing)) {
            existing.push(value);
          } else {
            entries[key] = [existing, value];
          }
        } else {
          entries[key] = value;
        }
      });

      // Пока просто логируем новые данные, без отправки на сервер
      // Вы сможете использовать эти данные для реального запроса
      // eslint-disable-next-line no-console
      console.log("Updated animal FormData:", entries);
    },
    [],
  );

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-6"
    >
      <input type="hidden" name="id" value={animal.id} />

      <div className="space-y-1.5">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-neutral-800"
        >
          Имя питомца
        </label>
        <input
          id="name"
          name="name"
          defaultValue={animal.name}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm outline-none ring-0 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/60"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="breed"
          className="block text-sm font-medium text-neutral-800"
        >
          Порода
        </label>
        <input
          id="breed"
          name="breed"
          defaultValue={animal.breed ?? ""}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm outline-none ring-0 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/60"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-neutral-800"
          >
            Возраст (лет)
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min={0}
            defaultValue={animal.age ?? ""}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm outline-none ring-0 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/60"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-neutral-800"
          >
            Пол
          </label>
          <select
            id="gender"
            name="gender"
            defaultValue={animal.gender}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm outline-none ring-0 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/60"
          >
            {(["Мальчик", "Девочка", "Неизвестно"] as Gender[]).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="size"
            className="block text-sm font-medium text-neutral-800"
          >
            Размер
          </label>
          <select
            id="size"
            name="size"
            defaultValue={animal.size}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm outline-none ring-0 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/60"
          >
            {(["Маленький", "Средний", "Большой"] as AnimalSize[]).map(
              (value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-neutral-800"
        >
          Описание
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={animal.description ?? ""}
          className="w-full resize-none rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-neutral-900 shadow-sm outline-none ring-0 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/60"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="images"
          className="block text-sm font-medium text-neutral-800"
        >
          Фото питомца
        </label>
        <p className="text-xs text-neutral-500">
          Можно добавить несколько изображений (до 5 МБ каждое, форматы,
          поддерживаемые multer на сервере).
        </p>
        <input
          id="images"
          name="images"
          type="file"
          multiple
          accept="image/*"
          className="block w-full cursor-pointer text-sm text-neutral-700 file:mr-3 file:rounded-full file:border-0 file:bg-amber-900/90 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white file:shadow-sm file:transition file:hover:bg-amber-900"
        />
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-900/90 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-900 md:w-auto"
        >
          Сохранить изменения
        </button>
      </div>
    </form>
  );
}

