import { Router } from "express";
import {
    listaAlugueis,
    inserirAluguel,
    finalizaAluguel,
} from "../controllers/rentalsController.js";
import finalizaAluguelSchemaValidationMiddleware from "../middlewares/finalizaAluguelMiddlewares.js";
import inserirAluguelSchemaValidationMiddleware from "../middlewares/inserirAluguelMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", listaAlugueis);
rentalsRouter.post(
    "/rentals",
    inserirAluguelSchemaValidationMiddleware,
    inserirAluguel
);
rentalsRouter.post(
    "/rentals/:id/return",
    finalizaAluguelSchemaValidationMiddleware,
    finalizaAluguel
);

export default rentalsRouter;
