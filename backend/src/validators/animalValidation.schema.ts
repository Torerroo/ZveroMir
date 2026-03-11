import { z } from "zod";

const baseAnimalQuerySchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  speciesId: z.coerce.number().int().positive().optional(),
  speciesName: z.string().optional(),
  gender: z.enum(["Мальчик", "Девочка", "Неизвестно"]).optional(),
  size: z.enum(["Маленький", "Средний", "Большой"]).optional(),
  q: z.string().min(1).optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
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

const baseAnimalFields = {
  name: z.string().min(1, "Имя обязательно").max(100, "Имя слишком длинное"),
  breed: z
    .string()
    .min(1, "Порода обязательна")
    .max(100, "Порода слишком длинная"),
  age: z.coerce
    .number()
    .int()
    .min(0, "Возраст не может быть отрицательным")
    .max(50, "Возраст слишком большой")
    .optional()
    .nullable(),
  gender: z.enum(["Мальчик", "Девочка", "Неизвестно"]),
  size: z.enum(["Маленький", "Средний", "Большой"]),
  description: z
    .string()
    .min(10, "Описание должно быть минимум 10 символов")
    .max(1000, "Описание слишком длинное")
    .optional()
    .nullable(),
  category: z.string().min(1, "Категория обязательна"),
  species: z.string().min(1, "Вид животного обязателен"),
};

export const animalCreateSchema = z.object({
  ...baseAnimalFields,
  images: z.array(z.string()).optional(),
});

export type AnimalCreate = z.infer<typeof animalCreateSchema>;

export const animalUpdateSchema = z.object({
  ...baseAnimalFields,
  existingImages: z.preprocess((val) => {
    const rawArray = !val ? [] : Array.isArray(val) ? val : [val];
    return rawArray.map((path: any) =>
      String(path)
        .replace(/^\/?static\//, "")
        .replace(/^\/+/, ""),
    );
  }, z.array(z.string()).optional()),
});

export type AnimalUpdate = z.infer<typeof animalUpdateSchema>;
