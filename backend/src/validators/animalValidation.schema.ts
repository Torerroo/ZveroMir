import { z } from "zod";

const baseAnimalQuerySchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  speciesId: z.coerce.number().int().positive().optional(),
  q: z.string().min(1).optional(),
});

export const animalQuerySchema = z.preprocess((raw) => {
  if (raw && typeof raw === "object") {
    const query = { ...(raw as Record<string, unknown>) };

    for (const [key, value] of Object.entries(query)) {
      if (typeof value === "string" && value.trim() === "") {
        delete query[key];
      }
    }

    return query;
  }

  return raw;
}, baseAnimalQuerySchema);

export type AnimalQuery = z.infer<typeof baseAnimalQuerySchema>;

export const animalIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type AnimalIdParams = z.infer<typeof animalIdParamSchema>;

export const animalCreateSchema = z.object({
  name: z.string().min(1, "Имя обязательно").max(100, "Имя слишком длинное"),
  breed: z
    .string()
    .min(1, "Порода обязательна")
    .max(100, "Порода слишком длинная"),
  age: z
    .number()
    .int()
    .min(0, "Возраст не может быть отрицательным")
    .max(50, "Возраст слишком большой")
    .optional(),
  gender: z.enum(["Мальчик", "Девочка", "Неизвестно"]),
  size: z.enum(["Маленький", "Средний", "Большой"]),
  description: z
    .string()
    .min(10, "Описание должно быть минимум 10 символов")
    .max(1000, "Описание слишком длинное")
    .optional(),
  category: z.string().min(1, "Категория обязательна"),
  species: z.string().min(1, "Вид животного обязателен"),
  imageUrl: z
    .string()
    .url("Неверный URL изображения")
    .optional()
    .or(z.literal("")),
});

export type AnimalCreate = z.infer<typeof animalCreateSchema>;
