import { Router } from "express";
import {
    listaAlugueis,
    inserirAluguel,
    finalizaAluguel,
    deletaAluguel,
} from "../controllers/rentalsController.js";
import deletaAluguelValidationMiddleware from "../middlewares/deletaAluguelMiddleware.js";
import finalizaAluguelValidationMiddleware from "../middlewares/finalizaAluguelMiddlewares.js";
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
    finalizaAluguelValidationMiddleware,
    finalizaAluguel
);
rentalsRouter.delete(
    "/rentals/:id",
    deletaAluguelValidationMiddleware,
    deletaAluguel
);

export default rentalsRouter;
