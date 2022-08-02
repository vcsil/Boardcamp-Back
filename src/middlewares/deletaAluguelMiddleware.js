import connection from "../database/database.js";

async function deletaAluguelValidationMiddleware(req, res, next) {
    const { id } = req.params;

    try {
        // Verifica se existe id
        const idExiste = await connection.query(
            `SELECT * FROM rentals WHERE id = $1`,
            [id]
        );
        if (idExiste.rowCount === 0) {
            return res.status(404).send("ID não existe.");
        }
        // Verifica se aluguel esta aberto
        const { returnDate } = idExiste.rows[0];
        if (returnDate !== null) {
            return res.status(400).send("Aluguel já finalizado.");
        }

        next()
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

export default deletaAluguelValidationMiddleware;
