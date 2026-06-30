import dotenv from "dotenv";
import app from "./src/app.js";
import pool from "./src/database/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        const connection = await pool.getConnection();

        console.log(" Banco conectado com sucesso!");

        connection.release();

        app.listen(PORT, () => {
            console.log(` Servidor rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error(" Erro ao conectar no banco:");
        console.error(error);
    }
}

startServer();