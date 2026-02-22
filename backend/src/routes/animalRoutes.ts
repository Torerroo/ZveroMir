import { Router } from "express";
import { animalController } from "../controllers/animalController";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/", animalController.getAnimals);
router.get("/species", animalController.getSpecies);
router.get("/:id", animalController.getAnimalById);

router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  animalController.createAnimal
);
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  animalController.updateAnimal
);
router.delete("/:id", authMiddleware, animalController.deleteAnimal);

export default router;
