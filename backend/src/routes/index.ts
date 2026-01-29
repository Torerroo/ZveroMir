import { Router } from "express";
import animalRouter from "./animalRoutes";

const apiRouter = Router();

apiRouter.use("/animals", animalRouter);

export default apiRouter;
