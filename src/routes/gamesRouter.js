import { Router } from "express";

import { AdicionaGames, ListaGames } from "../controllers/gamesController.js";
import adicionaGamesSchemaValidationMiddleware from "../middlewares/adicionaGamesMiddlewares.js";

const gamesRouter = Router();

gamesRouter.get("/games", ListaGames);
gamesRouter.post(
    "/games",
    adicionaGamesSchemaValidationMiddleware,
    AdicionaGames
);

export default gamesRouter;
