"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import type { AnimalWithRelations } from "@/types/animals";
import { AnimalEditForm } from "@/components/animals/AnimalEditForm";

type Props = {
  animal: AnimalWithRelations;
};

export function AnimalEditModal({ animal }: Props) {
  const [open, setOpen] = useState(false);
  const { isAuth } = useAuthStore();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalStyle;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, handleClose]);

  return (
    <>
      <button
        type="button"
        disabled={!isAuth}
        onClick={() => setOpen(true)}
        title={!isAuth ? "Войдите в профиль, чтобы вносить изменения" : ""}
        className={`
          inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs md:text-sm font-bold transition-all duration-300 border
          ${
            isAuth
              ? "border-[#7a4f2a]/30 bg-white/50 text-[#7a4f2a] hover:bg-[#eaddd0] hover:border-[#7a4f2a]/50 hover:shadow-sm active:scale-95 cursor-pointer"
              : "border-[#eaddd0] bg-[#fdfaf7] text-[#7a4f2a]/20 cursor-not-allowed"
          }
        `}
      >
        <Pencil
          size={15}
          className={isAuth ? "text-[#7a4f2a]" : "text-[#7a4f2a]/20"}
        />
        <span>Редактировать</span>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] bg-[#fdfaf7] shadow-[0_32px_120px_rgba(122,79,42,0.2)] border border-[#eaddd0]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#eaddd0]/50 px-8 py-6 bg-[#fdfaf7]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7a4f2a]/40 mb-1">
                    Карточка питомца
                  </p>
                  <h3 className="text-2xl font-black text-neutral-900 leading-none">
                    {animal.name}
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#7a4f2a]/5 text-[#7a4f2a]/50 transition-all hover:bg-[#7a4f2a]/10 hover:text-[#7a4f2a] cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="scrollbar-thin scrollbar-thumb-[#eaddd0] scrollbar-track-transparent flex-1 overflow-y-auto px-8 py-8">
                <AnimalEditForm animal={animal} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
