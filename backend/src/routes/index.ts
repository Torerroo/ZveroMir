import { Router } from "express";
import animalRouter from "./animalRoutes";
import authRouter from "./authRoutes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/animals", animalRouter);

export default apiRouter;
