import dayjs from "dayjs";

import connection from "../database/database.js";

export async function listaAlugueis(req, res) {
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

export async function inserirAluguel(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const rentDate = dayjs(Date.now()).format("YYYY-MM-DD"); // Data atual no momento da inserção
    const returnDate = null;
    const delayFee = null;

    try {
        // Pegando preço do jogo por dia
        const { rows: game } = await connection.query(
            `SELECT * FROM games WHERE id=$1`,
            [gameId]
        );
        const { pricePerDay } = game;
        const originalPrice =
            parseInt(pricePerDay, 10) * parseInt(daysRented, 10);

        await connection.query(
            `INSERT INTO rentals (customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee) 
             VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [
                customerId,
                gameId,
                rentDate,
                daysRented,
                returnDate,
                originalPrice,
                delayFee,
            ]
        );

        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
// [ customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee ]
