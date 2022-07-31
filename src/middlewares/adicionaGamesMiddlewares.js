import adicionaGamesSchema from "../schemas/adicionaGamesSchema.js";
import connection from "../database/database.js";

async function adicionaGamesSchemaValidationMiddleware(req, res, next) {
    const validation = adicionaGamesSchema.validate(req.body);
    const { name, categoryId } = req.body;

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    }

    const categoriaExiste = await connection.query(
        `SELECT * FROM categories WHERE id = $1`,
        [categoryId]
    );
    if (categoriaExiste.rowCount === 0) {
        return res.status(400).send("Categoria não existe.");
    }

    const nameExiste = await connection.query(
        `SELECT * FROM games WHERE name=$1`,
        [name]
    );
    if (nameExiste.rowCount > 0) {
        return res.status(409).send("Nome já existente.");
    }

    return next();
}

export default adicionaGamesSchemaValidationMiddleware;
