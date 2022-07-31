import { Router } from "express";
import ListaClientes from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get("/customers", ListaClientes);

export default customersRouter;
