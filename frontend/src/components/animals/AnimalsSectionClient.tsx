"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AnimalWithRelations, Gender, AnimalSize } from "@/types/animals";
import { AnimalCard } from "./AnimalCard";
import { api } from "@/api";

interface Species {
  id: number;
  name: string;
  categoryId: number;
}

interface AnimalsSectionClientProps {
  initialAnimals: AnimalWithRelations[];
  initialTotal: number;
  species: Species[];
}

const ICONS: Record<string, string> = {
  Кот: "😺",
  Собака: "🐶",
  Попугай: "🦜",
  Черепаха: "🐢",
  Экзотика: "🦎",
  default: "🐾",
};

export function AnimalsSectionClient({
  initialAnimals,
  initialTotal,
  species,
}: AnimalsSectionClientProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Данные
  const [animals, setAnimals] = useState(initialAnimals);
  const [loading, setLoading] = useState(false);

  const [selectedSpecies, setSelectedSpecies] = useState<string | number>(
    "all",
  );
  const [selectedGender, setSelectedGender] = useState<Gender | "all">("all");
  const [selectedSize, setSelectedSize] = useState<AnimalSize | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  const [itemsPerRow, setItemsPerRow] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isMounted, setIsMounted] = useState(false);

  const dynamicFilters = useMemo(() => {
    const filters = [
      { id: "all", label: "Все", icon: ICONS.default, type: "all" },
    ];

    species.forEach((s) => {
      if (s.categoryId === 1) {
        filters.push({
          id: s.name,
          label: s.name,
          icon: ICONS[s.name] || ICONS.default,
          type: "species",
        });
      }
    });

    if (species.some((s) => s.categoryId === 2)) {
      filters.push({
        id: "2",
        label: "Экзотика",
        icon: ICONS.Экзотика,
        type: "category",
      });
    }
    return filters;
  }, [species]);

  useEffect(() => {
    setIsMounted(true);
    if (!gridRef.current) return;
    const styles = window.getComputedStyle(gridRef.current);
    const columns = styles.getPropertyValue("grid-template-columns");
    const colsCount = columns.split(" ").filter(Boolean).length || 1;
    setItemsPerRow(colsCount);
    setVisibleCount(colsCount * 2);
  }, []);

  const fetchFiltered = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedGender !== "all") params.gender = selectedGender;
      if (selectedSize !== "all") params.size = selectedSize;

      const filter = dynamicFilters.find((f) => f.id === selectedSpecies);
      if (filter?.type === "category") params.categoryId = filter.id;
      else if (filter?.type === "species") params.speciesName = filter.id;

      const res = await api.animals.getAll(params);
      setAnimals(res.animals);

      setVisibleCount(itemsPerRow * 2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [
    selectedSpecies,
    selectedGender,
    selectedSize,
    itemsPerRow,
    dynamicFilters,
  ]);

  useEffect(() => {
    if (isMounted) fetchFiltered();
  }, [selectedSpecies, selectedGender, selectedSize]);

  const visibleAnimals = useMemo(() => {
    return animals.slice(0, visibleCount);
  }, [animals, visibleCount]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + itemsPerRow, animals.length));
  };

  const hasMore = visibleCount < animals.length;

  const resetFilters = () => {
    setSelectedSpecies("all");
    setSelectedGender("all");
    setSelectedSize("all");
  };

  return (
    <section
      className="relative overflow-hidden bg-[#fffef9] pt-12"
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
          className="relative mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-amber-900/90 sm:text-5xl">
            Наши питомцы
          </h2>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-48 h-4">
            <span
              className="absolute left-0 bottom-0 w-full h-[2px] bg-green-500/70"
              style={{
                transform: "scaleX(0.95) scaleY(1.5)",
                borderRadius: "50%",
              }}
            />
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-6 mb-16">
          <div className="flex flex-wrap justify-center gap-3">
            {dynamicFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedSpecies(filter.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 cursor-pointer
                  ${
                    selectedSpecies === filter.id
                      ? "bg-amber-900 text-white border-amber-900 shadow-lg scale-105"
                      : "bg-white text-amber-900 border-amber-100 hover:bg-amber-50"
                  }`}
              >
                <span className="text-xl">{filter.icon}</span>
                <span className="font-semibold">{filter.label}</span>
              </button>
            ))}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`ml-2 px-6 py-3 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer
                ${
                  showFilters
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-green-700 border-green-100"
                }`}
            >
              <span>{showFilters ? "✕" : "⚙️"}</span>
              <span className="font-semibold">Фильтры</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="w-full max-w-4xl overflow-hidden"
              >
                <div className="p-6 bg-white/70 backdrop-blur-md rounded-3xl border border-amber-100 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-amber-900/60 uppercase ml-1">
                      Пол
                    </p>
                    <div className="flex gap-2">
                      {["all", "Мальчик", "Девочка"].map((g) => (
                        <button
                          key={g}
                          onClick={() => setSelectedGender(g as any)}
                          className={`px-5 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer
                                ${
                                  selectedGender === g
                                    ? "bg-amber-200 border-amber-300 text-amber-900"
                                    : "bg-white border-gray-100 text-gray-600"
                                }`}
                        >
                          {g === "all" ? "Любой" : g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-amber-900/60 uppercase ml-1">
                      Размер
                    </p>
                    <div className="flex gap-2">
                      {["all", "Маленький", "Средний", "Большой"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s as any)}
                          className={`px-5 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer
                                ${
                                  selectedSize === s
                                    ? "bg-amber-200 border-amber-300 text-amber-900"
                                    : "bg-white border-gray-100 text-gray-600"
                                }`}
                        >
                          {s === "all" ? "Любой" : s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className={
            loading
              ? "opacity-50 pointer-events-none transition-opacity"
              : "transition-opacity"
          }
        >
          {visibleAnimals.length > 0 ? (
            <motion.div
              ref={gridRef}
              layout
              className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]"
            >
              <AnimatePresence mode="popLayout">
                {visibleAnimals.map((animal, index) => (
                  <motion.div
                    key={animal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
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
          ) : (
            !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center bg-white/40 rounded-3xl border-2 border-dashed border-amber-100"
              >
                <span className="text-5xl">🔎</span>
                <p className="mt-4 text-xl text-amber-900/60 font-medium">
                  Никого не нашлось
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 text-green-700 font-bold hover:underline cursor-pointer"
                >
                  Сбросить всё
                </button>
              </motion.div>
            )
          )}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-20">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadMore}
              className="group relative flex items-center gap-4 px-10 py-5 bg-white cursor-pointer rounded-2xl border border-amber-200/60 shadow-sm transition-all duration-300"
            >
              <span className="relative text-amber-900/80 group-hover:text-green-700 font-semibold text-lg">
                Показать ещё
              </span>
              <span className="relative flex items-center justify-center min-w-[40px] h-10 px-2 rounded-xl bg-amber-50 group-hover:bg-green-100 text-amber-700 group-hover:text-green-700 font-bold transition-colors">
                +{Math.min(itemsPerRow, animals.length - visibleCount)}
              </span>
            </motion.button>
          </div>
        )}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none bg-linear-to-t from-[#e0d6c8] to-transparent z-20"
        aria-hidden="true"
      />
    </section>
  );
}
