"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnimalWithRelations } from "@/types/animals";
import { AnimalCard } from "./AnimalCard";

interface AnimalsSectionClientProps {
  allAnimals: AnimalWithRelations[];
  total: number;
}

export function AnimalsSectionClient({
  allAnimals,
}: AnimalsSectionClientProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  const [itemsPerRow, setItemsPerRow] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!gridRef.current) return;

    const styles = window.getComputedStyle(gridRef.current);
    const columns = styles.getPropertyValue("grid-template-columns");
    const colsCount = columns.split(" ").filter(Boolean).length || 1;

    setItemsPerRow(colsCount);
    setVisibleCount(colsCount * 2);
  }, []);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + itemsPerRow, allAnimals.length));
  };

  const visibleAnimals = useMemo(() => {
    return allAnimals.slice(0, visibleCount);
  }, [allAnimals, visibleCount]);

  const hasMore = visibleCount < allAnimals.length;

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[#fffef9] pt-12"
      aria-label="Наши питомцы"
      id="animals-section"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(to bottom, #fffef9 0%, #ebe3d8 100%)`,
        }}
      />

      <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-30 pb-18">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-20 text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight text-amber-900/90 sm:text-5xl">
            Наши питомцы
          </h2>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-48 h-4">
            <span
              className="absolute left-0 bottom-0 w-full h-[2px] bg-green-500/70"
              style={{
                transform: "scaleX(0.95) scaleY(1.5)",
                borderRadius: "50%",
                filter: "drop-shadow(0 2px 2px rgba(34, 197, 94, 0.2))",
              }}
            />
          </div>
        </motion.div>

        <motion.div
          ref={gridRef}
          layout
          className="mt-12 grid gap-8 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]"
        >
          <AnimatePresence mode="popLayout">
            {visibleAnimals.map((animal, index) => (
              <motion.div
                key={animal.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: isMounted ? 0 : index * 0.05,
                }}
              >
                <AnimalCard animal={animal} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {hasMore && (
          <div className="flex justify-center mt-20">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadMore}
              className="group relative flex items-center gap-4 px-10 py-5 bg-white 
                         cursor-pointer overflow-hidden rounded-2xl border border-amber-200/60
                         shadow-[0_4px_20px_-4px_rgba(180,140,80,0.15)]
                         hover:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.3)]
                         hover:border-green-500/30 transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-linear-to-r from-transparent via-green-50/50 to-transparent 
                              -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              />

              <span className="relative text-amber-900/80 group-hover:text-green-700 font-semibold text-lg transition-colors">
                Показать ещё
              </span>

              <span
                className="relative flex items-center justify-center min-w-[40px] h-10 px-2 rounded-xl 
                               bg-amber-50 group-hover:bg-green-100 
                               text-amber-700 group-hover:text-green-700
                               font-bold transition-colors shadow-inner"
              >
                +{itemsPerRow || "?"}
              </span>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}
