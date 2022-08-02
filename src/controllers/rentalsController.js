/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
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
            {
                text: `
                    SELECT rentals.*, customers.name AS customer, games.name, categories.*
                    FROM rentals
                    JOIN customers ON customers.id=rentals."customerId"
                    JOIN games ON games.id=rentals."gameId"
                    JOIN categories ON categories.id=games."categoryId"
                    ${filtro}`,
                rowMode: "array"
            },params
        );

        res.status(200).send(alugueis.map(_mapRentalsArrayToObject));
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

function _mapRentalsArrayToObject(row) {
    const [
      id,
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
      customerName,
      gameName,
      categoryId,
      categoryName
    ] = row;
  
    return {
      id,
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
      customer: {
        id: customerId,
        name: customerName
      },
      game: {
        id: gameId,
        name: gameName,
        categoryId,
        categoryName
      }
    };
}

export async function inserirAluguel(req, res) {
    // [ customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee ]
    const { customerId, gameId, daysRented } = req.body;

    const rentDate = String(dayjs(Date.now()).format("YYYY-MM-DD")); // Data atual no momento da inserção
    const returnDate = null;
    const delayFee = null;

    try {
        // Pegando preço do jogo por dia
        const { rows: game } = await connection.query(
            `SELECT * FROM games WHERE id=$1`,
            [gameId]
        );
        const { pricePerDay } = game[0];
        const originalPrice =
            parseInt(pricePerDay, 10) * parseInt(daysRented, 10);

        await connection.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
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

function calculaDiferencaDias(rentDate, returnDate, daysRented) {
    rentDate = rentDate.replaceAll("-", "/");
    returnDate = returnDate.replaceAll("-", "/");

    const diaAlugado = new Date(rentDate);
    const diaDevolvido = new Date(returnDate);
    const timeDiff = Math.abs(diaDevolvido.getTime() - diaAlugado.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return diffDays - daysRented;
}

export async function finalizaAluguel(req, res) {
    const { id } = req.params;
    const returnDate = dayjs(Date.now()).format("YYYY-MM-DD");

    try {
        // Calculando atraso
        const { rows } = await connection.query(
            `SELECT * FROM rentals WHERE id=$1`,
            [id]
        );
        const aluguel = rows[0];
        const { daysRented, gameId } = aluguel;
        let { rentDate } = aluguel

        rentDate = String(dayjs(rentDate).format("YYYY-MM-DD"));

        const diferencaDias = calculaDiferencaDias(
            rentDate,
            returnDate,
            parseInt(daysRented, 10)
        );

        let delayFee = 0;

        if (diferencaDias > 0) {
            // eslint-disable-next-line no-shadow
            const { rows } = await connection.query(
                `SELECT * FROM games WHERE id=$1`,
                [gameId]
            );
            const { pricePerDay } = rows[0];
            delayFee = diferencaDias * parseInt(pricePerDay, 10);
        }

        await connection.query(
            `UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`,
            [returnDate, delayFee, id]
        );

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function deletaAluguel(req, res) {
    const { id } = req.params;

    console.log(id)

    try {
        await connection.query(`DELETE FROM rentals WHERE id=$1`, [id]);

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
