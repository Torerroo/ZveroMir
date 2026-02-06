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
