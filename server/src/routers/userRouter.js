import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// Rutas de usuarios
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

export default router;
