import express from "express";
import userRouter from "./userRouter.js";
//import tripRouter from "./tripRouter.js";
// En el futuro: import authRouter from "../auth/authRouter.js";

const router = express.Router();

// Montar las rutas principales
router.use("/users", userRouter);
//router.use("/trips", tripRouter);
// router.use("/auth", authRouter);  // ejemplo de futuro módulo de auth

export default router;
