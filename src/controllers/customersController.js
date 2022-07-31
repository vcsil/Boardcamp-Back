import connection from "../database/database.js";

export default async function ListaClientes(req, res) {
    const { cpf } = req.query;

    const params = [];
    let filtro = "";

    try {
        if (cpf) {
            params.push(`${cpf}%`);
            filtro += `WHERE customers.cpf ILIKE $${params.length}`;
        }

        const { rows: clientes } = await connection.query(
            `SELECT * FROM customers
            ${filtro}`,
            params
        );

        res.status(200).send(clientes);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
