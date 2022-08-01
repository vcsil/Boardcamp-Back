import inserirAluguelSchema from "../schemas/inserirAluguelSchema.js";
import connection from "../database/database.js";

async function inserirAluguelSchemaValidationMiddleware(req, res, next) {
    const validation = inserirAluguelSchema.validate(req.body);
    const { customerId } = req.body;
    const { gameId } = req.body;

    // Valida schema
    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    }

    try {
        // Verifica se existe cliente
        const customerIdExiste = await connection.query(
            `SELECT * FROM customers WHERE id = $1`,
            [customerId]
        );
        if (customerIdExiste.rowCount === 0) {
            return res.status(400).send("Cliente não existe.");
        }
        // Verifica se existe game
        const gameIdExiste = await connection.query(
            `SELECT * FROM games WHERE id = $1`,
            [gameId]
        );
        if (gameIdExiste.rowCount === 0) {
            return res.status(400).send("Game não existe.");
        }

        // Comparando a quantidade de jogos disponíveis e os alugados
        const result = await connection.query(
            `SELECT id
             FROM rentals 
             WHERE "gameId" = $1 AND "returnDate" IS null`,
            [gameId]
        );
        const stockTotal = gameIdExiste.rows[0];
        if (result.rowCount > 0) {
            if (stockTotal === result.rowCount) {
                return res.sendStatus(400);
            }
        }

        return next();
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

export default inserirAluguelSchemaValidationMiddleware;
