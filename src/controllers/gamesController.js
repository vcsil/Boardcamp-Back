import connection from "../database/database.js";

export async function ListaGames(req, res) {
    const { name } = req.query;

    const params = [];
    let filtro = "";

    try {
        if (name) {
            params.push(`${name}%`);
            filtro += `WHERE games.name ILIKE $${params.length}`;
        }

        const { rows: games } = await connection.query(
            `
            SELECT games.*, categories."name" AS "categoryName" 
            FROM games
            JOIN categories ON categories."id"=games."categoryId"
            ${filtro}
            `,
            params
        );

        res.send(games);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function AdicionaGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        await connection.query(
            `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`,
            [name, image, stockTotal, categoryId, pricePerDay]
        );

        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
