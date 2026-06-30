import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

app.use(express.json());

app.use("/categorias", categoryRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "API Cafeteria Online funcionando!"
    });
});

export default app;