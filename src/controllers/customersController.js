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
            return res.status(404).send("Id de usuário inexistente");
        }

        console.log(cliente)

        return res.status(200).send(cliente[0]);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

export async function insereCliente(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        await connection.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
            [name, phone, cpf, birthday]
        );

        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function atualizaCliente(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        await connection.query(
            `UPDATE customers SET "name"=$1, "phone"=$2, "cpf"=$3, "birthday"=$4 WHERE id=$5;`,
            [name, phone, cpf, birthday, id]
        );

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
