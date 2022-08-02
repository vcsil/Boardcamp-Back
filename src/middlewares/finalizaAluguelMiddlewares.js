import connection from "../database/database.js";

async function finalizaAluguelValidationMiddleware(req, res, next) {
    const { id } = req.params;

    try {
        // Verifica se existe aluguel
        const aluguelExiste = await connection.query(
            `SELECT * FROM rentals WHERE id = $1`,
            [id]
        );
        if (aluguelExiste.rowCount === 0) {
            return res.status(404).send("Aluguel não existe.");
        }
        // Verifica se aluguel esta aberto
        const { returnDate } = aluguelExiste.rows[0];
        if (returnDate !== null) {
            return res.status(400).send("Aluguel já finalizado.");
        }

        return next();
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

export default finalizaAluguelValidationMiddleware;
