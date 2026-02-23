"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { AnimalImage } from "@/types/animals";

type Props = {
  name: string;
  images: AnimalImage[];
};

export function AnimalGallery({ name, images }: Props) {
  if (!images || images.length === 0) {
    return null;
  }

  const sortedImages = useMemo(
    () =>
      [...images].sort((a, b) => {
        if (a.isMain === b.isMain) return 0;
        return a.isMain ? -1 : 1;
      }),
    [images],
  );

  const [activeId, setActiveId] = useState<number | null>(
    sortedImages[0]?.id ?? null,
  );

  const activeImage =
    sortedImages.find((img) => img.id === activeId) ?? sortedImages[0];

  return (
    <section
      aria-label={`Фотографии животного ${name}`}
      className="space-y-4 md:space-y-5"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-neutral-200/70 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage.id}
            initial={{ opacity: 0, scale: 1.02, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative h-full w-full"
          >
            <Image
              src={activeImage.url}
              alt={name}
              fill
              unoptimized
              className="object-cover object-[center_20%]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 720px"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
      </div>

      {sortedImages.length > 1 && (
        <div
          className="flex gap-3 overflow-x-auto overflow-y-hidden pb-1 pt-1 md:pt-2"
          onWheel={(event) => {
            if (event.deltaY === 0) return;
            event.currentTarget.scrollBy({
              left: event.deltaY,
              behavior: "smooth",
            });
            event.preventDefault();
          }}
        >
          {sortedImages.map((image) => {
            const isActive = image.id === activeImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveId(image.id)}
                className={`group relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border bg-neutral-200/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5efe5] md:h-28 md:w-40 ${
                  isActive
                    ? "border-amber-500/80 ring-1 ring-amber-500/70"
                    : "border-white/70"
                }`}
                aria-label={isActive ? "Текущее фото" : "Дополнительное фото"}
              >
                <motion.div
                  className="relative h-full w-full"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <Image
                    src={image.url}
                    alt={name}
                    fill
                    unoptimized
                    className="object-cover object-[center_20%]"
                    sizes="160px"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-100" />
                </motion.div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

