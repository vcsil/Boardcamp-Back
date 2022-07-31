import { Router } from "express";

import {
    listaClientes,
    buscaCliente,
    insereCliente,
} from "../controllers/customersController.js";
import insereClienteSchemaValidationMiddleware from "../middlewares/insereClienteMiddleware.js";

const customersRouter = Router();

customersRouter.get("/customers", listaClientes);
customersRouter.get("/customers/:id", buscaCliente);
customersRouter.post(
    "/customers",
    insereClienteSchemaValidationMiddleware,
    insereCliente
);

export default customersRouter;
