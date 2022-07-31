import connection from "../database/database.js";

export async function listaClientes(req, res) {
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

export async function buscaCliente(req, res) {
    const { id } = req.params;

    try {
        const { rows: cliente } = await connection.query(
            `SELECT * FROM customers WHERE id=$1`,
            [id]
        );
        if (cliente.length === 0) {
            return res.status(404).send("Id de usuário inexistênte");
        }

        return res.status(200).send(cliente);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}
