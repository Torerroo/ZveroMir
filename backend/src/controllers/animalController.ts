import { Request, Response, NextFunction } from "express";
import {
  Animal,
  AnimalWithRelations,
  AnimalsResponse,
} from "../types/animalType";
import {
  animalIdParamSchema,
  animalQuerySchema,
  animalCreateSchema,
} from "../validators/animalValidation.schema";
import { validationError } from "../utils/errors";
import { animalService } from "../services/animalService";

class AnimalController {
  getAnimals = async (
    req: Request,
    res: Response<AnimalsResponse>,
    next: NextFunction
  ) => {
    try {
      const parsedQuery = animalQuerySchema.safeParse(req.query);

      if (!parsedQuery.success) {
        return next(validationError(parsedQuery.error));
      }

      const animals = await animalService.getAll(parsedQuery.data);
      const total = animals.length;

      res.json({ animals, total });
    } catch (error) {
      next(error);
    }
  };

  getAnimalById = async (
    req: Request<{ id: string }>,
    res: Response<AnimalWithRelations>,
    next: NextFunction
  ) => {
    try {
      const parsedParams = animalIdParamSchema.safeParse(req.params);

      if (!parsedParams.success) {
        return next(validationError(parsedParams.error));
      }

      const animal = await animalService.getById(parsedParams.data.id);

      res.json(animal);
    } catch (error) {
      next(error);
    }
  };

  createAnimal = async (
    req: Request,
    res: Response<AnimalWithRelations>,
    next: NextFunction
  ) => {
    try {
      const parsedData = animalCreateSchema.safeParse(req.body);

      if (!parsedData.success) {
        return next(validationError(parsedData.error));
      }

      const createdAnimal = await animalService.create(parsedData.data);

      res.status(201).json(createdAnimal);
    } catch (error) {
      next(error);
    }
  };

  updateAnimal = async (
    req: Request<{ id: string }>,
    res: Response<Animal | { message: string }>,
    next: NextFunction
  ) => {
    try {
      // TODO: валидация id и тела запроса, обновление записи в БД
      // const id = Number(req.params.id);
      // const updated = await animalRepository.update(id, req.body);
      // if (!updated) {
      //   const err: AppError = new Error("Животное не найдено");
      //   err.statusCode = 404;
      //   err.code = "ANIMAL_NOT_FOUND";
      //   return next(err);
      // }
      res.json({ message: "Not implemented" });
    } catch (error) {
      next(error);
    }
  };

  deleteAnimal = async (
    req: Request<{ id: string }>,
    res: Response<{ success: boolean; message?: string }>,
    next: NextFunction
  ) => {
    try {
      // TODO: валидация id и удаление записи из БД
      // const id = Number(req.params.id);
      // const deleted = await animalRepository.delete(id);
      // if (!deleted) {
      //   const err: AppError = new Error("Животное не найдено");
      //   err.statusCode = 404;
      //   err.code = "ANIMAL_NOT_FOUND";
      //   return next(err);
      // }
      res.json({ success: false, message: "Not implemented" });
    } catch (error) {
      next(error);
    }
  };
}

export const animalController = new AnimalController();
