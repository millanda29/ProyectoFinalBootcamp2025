import express from "express";
import { getItinerary } from "../controllers/chatController.js";
import { authenticateJWT } from "../auth/authMiddleware.js";

const router = express.Router();

// Solo usuarios autenticados pueden pedir itinerarios
router.post("/", authenticateJWT, getItinerary);

export default router;
