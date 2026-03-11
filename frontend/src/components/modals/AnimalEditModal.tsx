"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import {
  Pencil,
  X,
  Trash2,
  Camera,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import type { AnimalWithRelations } from "@/types/animals";
import { api } from "@/api";
import { AnimalEditData, animalEditSchema } from "@/api/animals/animals.schema";
import { appToast } from "../ui/AppToast";

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
  const [images, setImages] = useState<ImageData[]>([]);
  const { isAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AnimalEditData>({
    resolver: zodResolver(animalEditSchema) as any,
  });

  useEffect(() => {
    if (open) {
      reset({
        name: animal.name,
        breed: animal.breed || "",
        age: animal.age || 0,
        gender: animal.gender as AnimalEditData["gender"],
        size: animal.size as AnimalEditData["size"],
        description: animal.description || "",
      });
      setImages(
        animal.images.map((img) => ({
          id: img.id,
          url: img.url,
          isNew: false,
        })),
      );
    }
  }, [open, animal, reset]);

  const selectedGender = watch("gender");
  const selectedSize = watch("size");

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [open]);

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

  const onSubmit: SubmitHandler<AnimalEditData> = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    formData.append("category", animal.category);
    formData.append("species", animal.species);

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
      appToast.success(`Изменения для ${response.name} сохранены`);
      handleClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Не удалось сохранить изменения";
      appToast.error(message);
    }
  };

  const labelClass =
    "block text-[12px] font-black uppercase tracking-[0.2em] text-[#7a4f2a]/50 mb-2 ml-1";
  const inputClass = (hasError: any) =>
    `w-full rounded-2xl border ${
      hasError ? "border-red-300 ring-4 ring-red-50" : "border-[#eaddd0]"
    } bg-white px-5 py-3 text-[16px] text-neutral-700 shadow-sm outline-none transition-all duration-200 hover:border-[#7a4f2a]/30 focus:border-[#7a4f2a]/50 focus:ring-4 focus:ring-[#7a4f2a]/5`;

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
              className="absolute inset-0 bg-black/10 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-[3rem] bg-[#fdfaf7] shadow-[0_20px_70px_rgba(122,79,42,0.12)] border border-[#eaddd0]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-10 py-8">
                <h3 className="text-2xl font-bold text-neutral-800 tracking-tight">
                  Редактирование
                </h3>
                <button
                  onClick={handleClose}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-[#7a4f2a]/5 text-[#7a4f2a]/40 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-10 pb-10 scrollbar-hide">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                  <LayoutGroup>
                    <div className="grid gap-6 md:grid-cols-2">
                      <motion.div layout="position">
                        <label className={labelClass}>Имя</label>
                        <input
                          {...register("name")}
                          className={inputClass(errors.name)}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-2 ml-2">
                            {errors.name.message}
                          </p>
                        )}
                      </motion.div>
                      <motion.div layout="position">
                        <label className={labelClass}>Порода</label>
                        <input
                          {...register("breed")}
                          className={inputClass(errors.breed)}
                        />
                        {errors.breed && (
                          <p className="text-red-500 text-xs mt-2 ml-2">
                            {errors.breed.message}
                          </p>
                        )}
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <motion.div layout="position">
                        <label className={labelClass}>Возраст</label>
                        <input
                          type="number"
                          {...register("age", { valueAsNumber: true })}
                          className={inputClass(errors.age)}
                        />
                        {errors.age && (
                          <p className="text-red-500 text-xs mt-2 ml-2">
                            {errors.age.message}
                          </p>
                        )}
                      </motion.div>
                      <motion.div layout="position">
                        <CustomSelect
                          label="Пол"
                          value={selectedGender}
                          onChange={(val) =>
                            setValue("gender", val as AnimalEditData["gender"])
                          }
                          options={["Мальчик", "Девочка", "Неизвестно"]}
                        />
                      </motion.div>
                      <motion.div layout="position">
                        <CustomSelect
                          label="Размер"
                          value={selectedSize}
                          onChange={(val) =>
                            setValue("size", val as AnimalEditData["size"])
                          }
                          options={["Маленький", "Средний", "Большой"]}
                        />
                      </motion.div>
                    </div>

                    <motion.div layout="position">
                      <label className={labelClass}>Описание</label>
                      <textarea
                        {...register("description")}
                        rows={3}
                        className={`${inputClass(errors.description)} resize-none`}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-xs mt-2 ml-2">
                          {errors.description.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div layout="position" className="space-y-3">
                      <label className={labelClass}>
                        Фотогалерея ({images.length})
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                        {images.map((img) => (
                          <div
                            key={img.id}
                            className="relative aspect-square rounded-2xl overflow-hidden border border-[#eaddd0] group shadow-sm bg-white"
                          >
                            <Image
                              src={
                                img.isNew ? img.url : `${staticBase}${img.url}`
                              }
                              alt="preview"
                              fill
                              unoptimized
                              className="object-cover"
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
                          className="aspect-square rounded-2xl border-2 border-dashed border-[#eaddd0] flex flex-col items-center justify-center text-[#7a4f2a]/30 hover:bg-[#7a4f2a]/5 transition-all cursor-pointer"
                        >
                          <Camera size={20} />
                          <span className="text-[9px] font-black mt-1 uppercase">
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
                    </motion.div>

                    <motion.div
                      layout="position"
                      className="flex justify-center pt-4"
                    >
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto min-w-[260px] px-10 py-4 bg-[#7a4f2a] text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-lg hover:bg-[#5d3c20] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          "Сохранить изменения"
                        )}
                      </button>
                    </motion.div>
                  </LayoutGroup>
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
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
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
        className="w-full flex items-center justify-between rounded-2xl border border-[#eaddd0] bg-white px-5 py-3 text-[16px] text-neutral-700 transition-all hover:border-[#7a4f2a]/30 shadow-sm cursor-pointer"
      >
        <span className="font-medium">{value}</span>
        <ChevronDown
          size={16}
          className={`text-[#7a4f2a]/30 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 w-full bg-white border border-[#eaddd0] rounded-3xl shadow-xl overflow-hidden py-1"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className="w-full px-5 py-3 text-left text-sm font-medium text-neutral-600 hover:bg-[#fdfaf7] hover:text-[#7a4f2a] flex items-center justify-between transition-colors cursor-pointer"
              >
                {opt}
                {value === opt && (
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
