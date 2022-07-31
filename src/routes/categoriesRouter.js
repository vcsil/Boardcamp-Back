import { Router } from "express";

import {
    ListaCategorias,
    AdicionaCategoria,
} from "../controllers/categoriesController.js";
import listaCategoriasSchemaValidationMiddleware from "../middlewares/listaCategoriasMiddlewares.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", ListaCategorias);

categoriesRouter.post(
    "/categories",
    listaCategoriasSchemaValidationMiddleware,
    AdicionaCategoria
);

export default categoriesRouter;
