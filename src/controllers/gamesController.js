import connection from "../database/database.js";

export default async function ListaGames(req, res) {
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
