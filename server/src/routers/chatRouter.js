import express from "express";
import { getItinerary, generateTripItinerary, chatAssistant } from "../controllers/chatController.js";
import { authenticateJWT } from "../auth/authMiddleware.js";

const router = express.Router();

// Solo usuarios autenticados pueden usar el chat
router.post("/itinerary", authenticateJWT, getItinerary);
router.post("/trip/:tripId/itinerary", authenticateJWT, generateTripItinerary);
router.post("/assistant", authenticateJWT, chatAssistant);

export default router;
