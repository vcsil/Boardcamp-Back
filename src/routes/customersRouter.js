import { Router } from "express";

import {
    listaClientes,
    buscaCliente,
    insereCliente,
    atualizaCliente,
} from "../controllers/customersController.js";
import atualizaClienteSchemaValidationMiddleware from "../middlewares/atualizaClienteMiddleware.js";
import insereClienteSchemaValidationMiddleware from "../middlewares/insereClienteMiddleware.js";

const customersRouter = Router();

customersRouter.get("/customers", listaClientes);
customersRouter.get("/customers/:id", buscaCliente);
customersRouter.post(
    "/customers",
    insereClienteSchemaValidationMiddleware,
    insereCliente
);
customersRouter.put(
    "/customers/:id",
    atualizaClienteSchemaValidationMiddleware,
    atualizaCliente
);

export default customersRouter;
