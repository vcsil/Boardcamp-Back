import { Router } from "express";
import listaAlugueis from "../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", listaAlugueis);

export default rentalsRouter;
