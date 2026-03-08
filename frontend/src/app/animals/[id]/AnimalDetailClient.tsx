"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { AnimalGallery } from "@/components/animals/AnimalGallery";
import { AnimalEditModal } from "@/components/modals/AnimalEditModal";
import {
  MapPin,
  Mars,
  Venus,
  History,
  AlertCircle,
  Maximize2,
} from "lucide-react";
import type { AnimalWithRelations } from "@/types/animals";

export function AnimalDetailClient({
  animal,
}: {
  animal: AnimalWithRelations;
}) {
  const { isAuth } = useAuthStore();

  const ageText = animal.age
    ? `${animal.age} ${animal.age === 1 ? "год" : animal.age < 5 ? "года" : "лет"}`
    : "Возраст уточняется";

  const GenderIcon = animal.gender === "Мальчик" ? Mars : Venus;

  return (
    <main className="mx-auto max-w-[1440px] px-6 md:px-12 pb-32 pt-10 md:pt-16 font-medium">
      <div className="grid gap-10 xl:gap-16 xl:grid-cols-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="xl:col-span-7 w-full"
        >
          <div className="xl:sticky xl:top-28 rounded-4xl md:rounded-[3rem] overflow-hidden shadow-sm">
            <AnimalGallery name={animal.name} images={animal.images} />
          </div>
        </motion.div>

        <div className="xl:col-span-5 space-y-10 md:space-y-12">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="flex flex-wrap justify-between items-end gap-4">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-neutral-900 leading-[0.9]">
                {animal.name}
              </h1>

              <AnimalEditModal animal={animal} />
            </div>
            <p className="text-[22px] md:text-[24px] font-bold text-[#7a4f2a]/70">
              {animal.breed || animal.species}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5"
          >
            {[
              {
                label: "Пол",
                val: animal.gender,
                icon: <GenderIcon size={22} />,
              },
              {
                label: "Размер",
                val: animal.size,
                icon: <Maximize2 size={22} />,
              },
              { label: "Возраст", val: ageText, icon: <History size={22} /> },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/60 border border-[#eaddd0] p-6 rounded-4xl flex flex-row sm:flex-col items-center sm:items-start gap-4 transition-all duration-300 hover:bg-white"
              >
                <div className="text-[#7a4f2a]/60 shrink-0">{stat.icon}</div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#7a4f2a]/50 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-[17px] md:text-[18px] font-black text-neutral-800 leading-tight">
                    {stat.val}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 pt-2"
          >
            <div className="flex items-center gap-3 text-[#7a4f2a]/50">
              <AlertCircle size={22} />
              <span className="text-[12px] md:text-[13px] font-black uppercase tracking-[0.2em]">
                Описание питомца
              </span>
            </div>
            <div className="max-w-prose border-l-2 border-[#eaddd0] pl-6 md:pl-8">
              <p className="text-[19px] md:text-[21px] leading-relaxed text-neutral-800 font-medium italic opacity-90">
                {animal.description || "Этот хвостик ждет встречи с вами."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mt-24 md:mt-40 rounded-[2.5rem] md:rounded-[4rem] border border-[#eaddd0] p-10 md:p-24 text-center bg-white/40 backdrop-blur-md"
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-[#7a4f2a]/5 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="text-[#7a4f2a]/30" size={32} />
          </div>
          <p className="text-[#7a4f2a]/70 text-[16px] md:text-[18px] font-medium leading-relaxed">
            Здесь позже можно будет добавить карту Яндекс с выбором адреса и
            оформлением доставки питомца. Блок уже вписан в композицию страницы.
          </p>
        </div>
      </motion.section>
    </main>
  );
}
