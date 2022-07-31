import { Router } from "express";
import {
    listaAlugueis,
    inserirAluguel,
} from "../controllers/rentalsController.js";
import inserirAluguelSchemaValidationMiddleware from "../middlewares/inserirAluguelMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", listaAlugueis);
rentalsRouter.post(
    "/rentals",
    inserirAluguelSchemaValidationMiddleware,
    inserirAluguel
);

export default rentalsRouter;
