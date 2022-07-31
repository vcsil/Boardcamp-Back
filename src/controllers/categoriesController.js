import connection from "../database/database.js";

export default async function ListaCategorias(req, res) {
    const query = `SELECT * FROM categories;`;

    try {
        const { rows: categorias } = await connection.query(query);

        res.send(categorias);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
