import { z } from "zod";

export const animalQuerySchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  speciesId: z.coerce.number().int().positive().optional(),
  q: z.string().min(1).optional(),
});

export type AnimalQuery = z.infer<typeof animalQuerySchema>;
