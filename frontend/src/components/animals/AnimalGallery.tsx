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
    <section className="relative w-full group">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-[2.5rem] bg-neutral-200/70 shadow-[0_24px_80px_rgba(0,0,0,0.15)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <Image
              src={activeImage.url}
              fill
              className="object-cover"
              alt={name}
              unoptimized
              priority
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/40 to-transparent" />

        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl transition-all duration-300 hover:bg-white/30">
            {sortedImages.slice(0, 5).map((image, index) => {
              const isActive = image.id === activeId;
              const isLastVisible = index === 4 && sortedImages.length > 5;

              return (
                <button
                  key={image.id}
                  onClick={() => setActiveId(image.id)}
                  className={`relative h-14 w-14 shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
                    isActive
                      ? "ring-2 ring-white scale-110 shadow-lg z-10"
                      : "opacity-70 hover:opacity-100 scale-100"
                  }`}
                >
                  <Image
                    src={image.url}
                    fill
                    className="object-cover cursor-pointer"
                    alt=""
                    unoptimized
                  />

                  {isLastVisible && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-white text-xs font-black tracking-tighter">
                        +{sortedImages.length - 4}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
