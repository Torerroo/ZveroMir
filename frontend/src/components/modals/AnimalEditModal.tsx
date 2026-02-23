"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { AnimalWithRelations } from "@/types/animals";
import { AnimalEditForm } from "@/components/animals/AnimalEditForm";

type Props = {
  animal: AnimalWithRelations;
};

export function AnimalEditModal({ animal }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-amber-900/90 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-900 md:text-sm"
      >
        ✏️ Редактировать
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-4 py-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white/95 shadow-[0_24px_80px_rgba(0,0,0,0.40)] backdrop-blur-md"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3.5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                    Редактирование питомца
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 md:text-base">
                    {animal.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 shadow-sm transition hover:bg-neutral-200"
                  aria-label="Закрыть"
                >
                  ✕
                </button>
              </div>

              <div className="scrollbar-thin scrollbar-thumb-neutral-300/80 scrollbar-track-transparent flex-1 overflow-y-auto px-5 py-4">
                <AnimalEditForm animal={animal} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
