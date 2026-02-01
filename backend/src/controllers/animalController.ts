import { Request, Response, NextFunction } from "express";
import {
  Animal,
  AnimalWithRelations,
  AnimalsResponse,
} from "../types/animalType";
import { AppError } from "../middleware/errorHandler";
import { animalModel } from "../models/animalModel";
import { animalQuerySchema } from "../validators/animalQuery.schema";

class AnimalController {
  getAnimals = async (
    req: Request,
    res: Response<AnimalsResponse>,
    next: NextFunction
  ) => {
    try {
      const parsedQuery = animalQuerySchema.safeParse(req.query);

      if (!parsedQuery.success) {
        const err: AppError = new Error("Некорректные query параметры");
        err.statusCode = 400;
        err.code = "INVALID_QUERY_PARAMS";
        err.details = parsedQuery.error.format();
        return next(err);
      }

      const animals = animalModel.findAll(parsedQuery.data);
      const total = animals.length;

      res.json({ animals, total });
    } catch (error) {
      next(error);
    }
  };

  getAnimalById = async (
    req: Request<{ id: string }>,
    res: Response<AnimalWithRelations | Animal | { message: string }>,
    next: NextFunction
  ) => {
    try {
      // TODO: валидация/парсинг id, запрос в БД за одним животным
      // const id = Number(req.params.id);
      // const animal = await animalModel.findById(id);
      // if (!animal) {
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

  createAnimal = async (
    req: Request,
    res: Response<Animal | { message: string }>,
    next: NextFunction
  ) => {
    try {
      // TODO: валидация тела запроса и создание записи в БД
      // const created = await animalModel.create(req.body);
      res.json({ message: "Not implemented" });
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
      // const updated = await animalModel.update(id, req.body);
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
      // const deleted = await animalModel.delete(id);
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
