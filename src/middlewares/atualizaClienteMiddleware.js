import insereClienteSchema from "../schemas/insereClienteSchema.js";
import connection from "../database/database.js";

async function atualizaClienteSchemaValidationMiddleware(req, res, next) {
    const validation = insereClienteSchema.validate(req.body);
    const { cpf } = req.body;
    const { id } = req.params;

    // Valida schema
    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    }

    try {
        // Verifica se existe id
        const idExiste = await connection.query(
            `SELECT * FROM customers WHERE id = $1`,
            [id]
        );
        if (idExiste.rowCount === 0) {
            return res.status(404).send("ID não existe.");
        }

        // Verifica se existe cpf igual e se ele pertence ao usuário atual
        const cpfExiste = await connection.query(
            `SELECT * FROM customers WHERE cpf = $1`,
            [cpf]
        );
        const cpfDoIdAtual =
            parseInt(cpfExiste.rows[0].id, 10) === parseInt(id, 10);

        if (cpfExiste.rowCount > 0 && !cpfDoIdAtual) {
            return res.status(409).send("CPF já existe.");
        }

        return next();
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

export default atualizaClienteSchemaValidationMiddleware;
