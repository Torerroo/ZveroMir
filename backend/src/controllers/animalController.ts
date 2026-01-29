import { Request, Response } from "express";
import { Animal, AnimalWithRelations } from "../types/animalType";

class AnimalController {
  getAnimals = async (
    req: Request,
    res: Response<AnimalWithRelations[] | Animal[]>
  ) => {
    res.json([]);
  };

  getAnimalById = async (
    req: Request<{ id: string }>,
    res: Response<AnimalWithRelations | Animal | { message: string }>
  ) => {
    res.json({ message: "Not implemented" });
  };

  createAnimal = async (
    req: Request,
    res: Response<Animal | { message: string }>
  ) => {
    res.json({ message: "Not implemented" });
  };

  updateAnimal = async (
    req: Request<{ id: string }>,
    res: Response<Animal | { message: string }>
  ) => {
    res.json({ message: "Not implemented" });
  };

  deleteAnimal = async (
    req: Request<{ id: string }>,
    res: Response<{ success: boolean; message?: string }>
  ) => {
    res.json({ success: false, message: "Not implemented" });
  };
}

export const animalController = new AnimalController();
