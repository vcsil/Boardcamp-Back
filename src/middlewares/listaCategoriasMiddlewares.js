import listaCategoriasSchema from "../schemas/listaCategoriasSchema.js";
import connection from "../database/database.js";

async function listaCategoriasSchemaValidationMiddleware(req, res, next) {
    const validation = listaCategoriasSchema.validate(req.body);
    const { name } = req.body;

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    }

    const categoriaExiste = await connection.query(
        `SELECT * FROM categories WHERE name=$1`,
        [name]
    );
    if (categoriaExiste.rowCount > 0) {
        return res.status(409).send("Categoria já existente.");
    }

    return next();
}

export default listaCategoriasSchemaValidationMiddleware;
