import { Router } from "express";

import {
    ListaCategorias,
    AdicionaCategoria,
} from "../controllers/categoriesController.js";
import adicionaCategoriaSchemaValidationMiddleware from "../middlewares/adicionaCategoriaMiddlewares.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", ListaCategorias);

categoriesRouter.post(
    "/categories",
    adicionaCategoriaSchemaValidationMiddleware,
    AdicionaCategoria
);

export default categoriesRouter;
