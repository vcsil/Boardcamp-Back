import connection from "../database/database.js";

export default async function listaAlugueis(req, res) {
    const { customerId, gameId } = req.query;

    const params = [];
    const condicao = [];
    let filtro = "";

    try {
        if (customerId) {
            params.push(customerId);
            condicao.push(`rentals."customerId" = $${params.length}`);
        }

        if (gameId) {
            params.push(gameId);
            condicao.push(`rentals."gameId"=$${params.length}`);
        }

        if (params.length > 0) {
            filtro += `WHERE ${condicao.join(" AND ")}`;
        }

        const { rows: alugueis } = await connection.query(
            `SELECT rentals.*, customers.name AS customer, games.name, categories.*
             FROM rentals
             JOIN customers ON customers.id=rentals."customerId"
             JOIN games ON games.id=rentals."gameId"
             JOIN categories ON categories.id=games."categoryId"
            ${filtro}`,
            params
        );

        res.status(200).send(alugueis);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
