import { Request, Response, NextFunction } from "express";
import { AnimalsResponse } from "../types/animalType";
import {
  animalIdParamSchema,
  animalQuerySchema,
  animalCreateSchema,
  animalUpdateSchema,
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

      const result = await animalService.getAll(parsedQuery.data);

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getSpecies = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const species = await animalService.getSpecies();
      res.json(species);
    } catch (error) {
      next(error);
    }
  };

  getAnimalById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsedParams = animalIdParamSchema.safeParse(req.params);
      if (!parsedParams.success)
        return next(validationError(parsedParams.error));
      const animal = await animalService.getById(parsedParams.data.id);
      res.json(animal);
    } catch (error) {
      next(error);
    }
  };

  createAnimal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = animalCreateSchema.safeParse(req.body);
      if (!parsedData.success) return next(validationError(parsedData.error));
      const createdAnimal = await animalService.create(parsedData.data);
      res.status(201).json(createdAnimal);
    } catch (error) {
      next(error);
    }
  };

  updateAnimal = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsedParams = animalIdParamSchema.safeParse(req.params);
      if (!parsedParams.success)
        return next(validationError(parsedParams.error));
      const parsedData = animalUpdateSchema.safeParse(req.body);
      if (!parsedData.success) return next(validationError(parsedData.error));
      const updatedAnimal = await animalService.update(
        parsedParams.data.id,
        parsedData.data
      );
      res.json(updatedAnimal);
    } catch (error) {
      next(error);
    }
  };

  deleteAnimal = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsedParams = animalIdParamSchema.safeParse(req.params);
      if (!parsedParams.success)
        return next(validationError(parsedParams.error));
      await animalService.delete(parsedParams.data.id);
      res.json({ success: true, message: "Животное успешно удалено" });
    } catch (error) {
      next(error);
    }
  };
}

export const animalController = new AnimalController();
