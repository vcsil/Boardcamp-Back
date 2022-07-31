import { Router } from "express";

import ListaCategorias from "../controllers/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", ListaCategorias);

export default categoriesRouter;
