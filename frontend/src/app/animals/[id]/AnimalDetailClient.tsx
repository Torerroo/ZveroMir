"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimalGallery } from "@/components/animals/AnimalGallery";
import { AnimalEditModal } from "@/components/modals/AnimalEditModal";
import {
  MapPin,
  Mars,
  Venus,
  History,
  AlertCircle,
  Maximize2,
  Truck,
  Home,
  ChevronRight,
} from "lucide-react";
import type { AnimalWithRelations } from "@/types/animals";
import { LocationMap } from "@/components/maps/LocationMap";

export function AnimalDetailClient({
  animal,
}: {
  animal: AnimalWithRelations;
}) {
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const ageText = animal.age
    ? `${animal.age} ${animal.age === 1 ? "год" : animal.age < 5 ? "года" : "лет"}`
    : "Возраст уточняется";

  const GenderIcon = animal.gender === "Мальчик" ? Mars : Venus;

  return (
    <main className="mx-auto max-w-[1440px] px-6 md:px-12 pb-16 pt-10 md:pt-16 font-medium">
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

      <div className="mt-18 space-y-12">
        <div className="flex flex-col items-center text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">
            Где вы встретитесь?
          </h2>
          <p className="text-[#7a4f2a]/50 font-bold uppercase text-[12px] tracking-[0.3em]">
            Выберите точку на карте
          </p>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full rounded-[3.5rem] md:rounded-[5rem] border border-[#eaddd0] overflow-hidden bg-white/40 backdrop-blur-md shadow-2xl shadow-[#7a4f2a]/5"
        >
          <LocationMap onAddressSelect={(addr) => setSelectedAddress(addr)} />
        </motion.section>

        {
          <AnimatePresence mode="wait">
            {selectedAddress && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mx-auto max-w-4xl w-full"
              >
                <div className="bg-white/80 backdrop-blur-xl border border-[#eaddd0] rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(122,79,42,0.1)] transition-all duration-500">
                  <div className="flex flex-col gap-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2 text-[#7a4f2a]/60">
                          <MapPin size={18} className="animate-bounce" />
                          <span className="text-[11px] font-black uppercase tracking-[0.25em]">
                            Пункт встречи выбран
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-neutral-900 leading-tight tracking-tight">
                          {selectedAddress}
                        </h3>
                      </div>

                      <div className="w-full md:w-48 shrink-0">
                        <div className="relative group">
                          <Home
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a4f2a]/30 group-focus-within:text-[#7a4f2a] transition-colors"
                            size={18}
                          />
                          <input
                            type="text"
                            placeholder="Кв / Офис"
                            className="w-full bg-[#fdfaf7] border border-[#eaddd0] rounded-2xl py-5 pl-12 pr-4 
                             text-[17px] font-bold text-neutral-900 outline-none 
                             focus:ring-4 focus:ring-[#7a4f2a]/5 focus:border-[#7a4f2a]/20 
                             transition-all placeholder:text-[#7a4f2a]/30"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center">
                      <div className="grow h-px bg-linear-to-r from-transparent via-[#eaddd0] to-transparent"></div>
                      <div className="absolute left-1/2 -translate-x-1/2 bg-white px-4">
                        <div className="bg-[#fdfaf7] p-2 rounded-full border border-[#eaddd0]">
                          <Truck size={18} className="text-[#7a4f2a]/40" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <p className="text-[#7a4f2a]/40 text-sm font-bold max-w-[280px] text-center md:text-left leading-relaxed">
                        Мы доставим хвостика по указанному адресу в удобное для
                        вас время
                      </p>

                      <button className="cursor-pointer group relative w-full md:w-auto min-w-[260px] bg-[#7a4f2a] hover:bg-[#5d3c20] text-white py-6 px-10 rounded-4xl transition-all shadow-xl shadow-[#7a4f2a]/20 active:scale-95 overflow-hidden">
                        <div className="relative z-10 flex items-center justify-center gap-3">
                          <span className="text-[14px] font-black uppercase tracking-[0.2em]">
                            Отправить заявку
                          </span>
                          <ChevronRight
                            size={20}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        }
      </div>
    </main>
  );
}
