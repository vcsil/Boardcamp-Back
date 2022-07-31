import insereClienteSchema from "../schemas/insereClienteSchema.js";
import connection from "../database/database.js";

async function insereClienteSchemaValidationMiddleware(req, res, next) {
    const validation = insereClienteSchema.validate(req.body);
    const { cpf } = req.body;

    // Valida schema
    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    }

    try {
        // Verifica se existe cpf igual
        const cpfExiste = await connection.query(
            `SELECT * FROM customers WHERE cpf = $1`,
            [cpf]
        );
        if (cpfExiste.rowCount > 0) {
            return res.status(409).send("CPF já existe.");
        }

        return next();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export default insereClienteSchemaValidationMiddleware;
