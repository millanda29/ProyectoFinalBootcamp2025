import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routers/index.js";

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas principales agrupadas
app.use("/api", router);

export default app;
