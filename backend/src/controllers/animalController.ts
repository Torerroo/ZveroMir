import { Request, Response, NextFunction } from "express";
import { Animal, AnimalWithRelations } from "../types/animalType";
import { AppError } from "../middleware/errorHandler";

class AnimalController {
  getAnimals = async (
    req: Request,
    res: Response<AnimalWithRelations[] | Animal[]>,
    next: NextFunction
  ) => {
    try {
      // TODO: запрос в БД за списком животных
      // const animals = await animalModel.findAll();
      res.json([]);
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
