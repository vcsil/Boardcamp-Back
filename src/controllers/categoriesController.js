import connection from "../database/database.js";

export async function ListaCategorias(req, res) {
    const query = `SELECT * FROM categories;`;

    try {
        const { rows: categorias } = await connection.query(query);

        res.send(categorias);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function AdicionaCategoria(req, res) {
    const { name } = req.body;

    try {
        await connection.query("INSERT INTO categories (name) VALUES ($1);", [
            name,
        ]);

        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
