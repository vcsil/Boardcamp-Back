import { Router } from "express";

import ListaGames from "../controllers/gamesController.js";

const gamesRouter = Router();

gamesRouter.get("/games", ListaGames);

export default gamesRouter;
