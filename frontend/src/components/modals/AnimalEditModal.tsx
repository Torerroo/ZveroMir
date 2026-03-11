"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, X, Trash2, Camera, Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import type { AnimalWithRelations } from "@/types/animals";
import { api } from "@/api";

const staticBase = process.env.NEXT_PUBLIC_STATIC_URL || "";

type ImageData = {
  id: string | number;
  url: string;
  isNew: boolean;
  file?: File;
};

type Props = {
  animal: AnimalWithRelations;
  onUpdate: (updated: AnimalWithRelations) => void;
};

export function AnimalEditModal({ animal, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ImageData[]>(
    animal.images.map((img) => ({ id: img.id, url: img.url, isNew: false })),
  );
  const { isAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, handleClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages: ImageData[] = filesArray.map((file) => ({
        id: `new-${Math.random().toString(36).substr(2, 9)}`,
        url: URL.createObjectURL(file),
        isNew: true,
        file: file,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string | number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!formData.has("category")) formData.append("category", animal.category);
    if (!formData.has("species")) formData.append("species", animal.species);

    images.forEach((img) => {
      if (img.isNew && img.file) {
        formData.append("images", img.file);
      } else if (!img.isNew) {
        formData.append("existingImages", img.url);
      }
    });

    try {
      const response = await api.animals.update(String(animal.id), formData);
      onUpdate(response);
      handleClose();
    } catch (error) {
      console.error("❌ Ошибка при сохранении:", error);
    }
  };

  const labelClass =
    "block text-[12px] font-black uppercase tracking-[0.2em] text-[#7a4f2a]/50 mb-2 ml-1";
  const inputClass =
    "w-full rounded-2xl border border-[#eaddd0] bg-white px-5 py-3 text-[16px] text-neutral-700 shadow-sm outline-none transition-all duration-200 hover:border-[#7a4f2a]/30 focus:border-[#7a4f2a]/50 focus:ring-4 focus:ring-[#7a4f2a]/5";

  return (
    <>
      <button
        type="button"
        disabled={!isAuth}
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs md:text-sm font-bold transition-all duration-300 border ${
          isAuth
            ? "border-[#7a4f2a]/30 bg-white/50 text-[#7a4f2a] hover:bg-[#eaddd0] cursor-pointer shadow-sm"
            : "border-[#eaddd0] bg-[#fdfaf7] text-[#7a4f2a]/20 cursor-not-allowed"
        }`}
      >
        <Pencil size={15} />
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
              className="absolute inset-0 bg-black/10 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-[3rem] bg-[#fdfaf7] shadow-[0_20px_70px_rgba(122,79,42,0.12)] border border-[#eaddd0]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-10 py-8">
                <h3 className="text-2xl font-bold text-neutral-800 tracking-tight">
                  Редактирование питомца
                </h3>
                <button
                  onClick={handleClose}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-[#7a4f2a]/5 text-[#7a4f2a]/40 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-10 pb-10 scrollbar-hide">
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Имя</label>
                      <input
                        name="name"
                        defaultValue={animal.name}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Порода</label>
                      <input
                        name="breed"
                        defaultValue={animal.breed ?? ""}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Возраст</label>
                      <input
                        name="age"
                        type="number"
                        defaultValue={animal.age ?? ""}
                        className={inputClass}
                      />
                    </div>
                    <CustomSelect
                      label="Пол"
                      name="gender"
                      defaultValue={animal.gender}
                      options={["Мальчик", "Девочка", "Неизвестно"]}
                    />
                    <CustomSelect
                      label="Размер"
                      name="size"
                      defaultValue={animal.size}
                      options={["Маленький", "Средний", "Большой"]}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Описание</label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={animal.description ?? ""}
                      className={`${inputClass} resize-none pr-6 scrollbar-thin scrollbar-thumb-[#eaddd0] scrollbar-track-transparent`}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className={labelClass}>
                      Фотогалерея ({images.length})
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {images.map((img) => (
                        <div
                          key={img.id}
                          className="relative aspect-square rounded-2xl overflow-hidden border border-[#eaddd0] group cursor-pointer shadow-sm bg-white"
                        >
                          <Image
                            src={
                              img.isNew ? img.url : `${staticBase}${img.url}`
                            }
                            alt="preview"
                            fill
                            unoptimized
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute inset-0 flex items-center justify-center bg-red-500/70 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-[#eaddd0] flex flex-col items-center justify-center text-[#7a4f2a]/30 hover:bg-[#7a4f2a]/5 hover:border-[#7a4f2a]/60 hover:text-[#7a4f2a] transition-all cursor-pointer"
                      >
                        <Camera size={20} />
                        <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">
                          Добавить
                        </span>
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="w-full md:w-auto min-w-[260px] px-10 py-4 bg-[#7a4f2a] text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-lg shadow-[#7a4f2a]/15 hover:bg-[#5d3c20] hover:-translate-y-px active:translate-y-0 transition-all cursor-pointer"
                    >
                      Сохранить изменения
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function CustomSelect({
  label,
  options,
  defaultValue,
  name,
}: {
  label: string;
  options: string[];
  defaultValue: string;
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-[12px] font-black uppercase tracking-[0.2em] text-[#7a4f2a]/50 mb-2 ml-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-2xl border border-[#eaddd0] bg-white px-5 py-3 text-[16px] text-neutral-700 transition-all hover:border-[#7a4f2a]/30 cursor-pointer shadow-sm"
      >
        <span className="font-medium">{selected}</span>
        <ChevronDown
          size={16}
          className={`text-[#7a4f2a]/30 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <input type="hidden" name={name} value={selected} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 w-full bg-white border border-[#eaddd0] rounded-3xl shadow-[0_15px_45px_rgba(122,79,42,0.1)] overflow-hidden py-1"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                }}
                className="w-full px-5 py-3 text-left text-sm font-medium text-neutral-600 hover:bg-[#fdfaf7] hover:text-[#7a4f2a] flex items-center justify-between transition-colors cursor-pointer"
              >
                {opt}
                {selected === opt && (
                  <Check size={14} className="text-[#7a4f2a]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
