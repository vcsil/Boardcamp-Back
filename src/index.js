import express from "express";
import chalk from "chalk";
import cors from "cors";

import connection from "./database/database.js";

const server = express();
server.use(express.json());
server.use(cors());

server.get("/", async (req, res) => {
    try {
        const { rows: games } = await connection.query(`
            SELECT * FROM games;
        `);

        res.send(games);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

server.listen(process.env.PORT, () => {
    console.log(
        chalk.magenta(`Server is listening on port ${process.env.PORT}`)
    );
});
