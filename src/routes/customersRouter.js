import { Router } from "express";

import {
    listaClientes,
    buscaCliente,
} from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get("/customers", listaClientes);
customersRouter.get("/customers/:id", buscaCliente);

export default customersRouter;
