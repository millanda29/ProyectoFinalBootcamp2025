import express from "express";
import { getItinerary, generateTripItinerary, chatAssistant } from "../controllers/chatController.js";
import { authenticateJWT } from "../auth/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat & AI
 *   description: Endpoints para funcionalidades de chat e inteligencia artificial
 */

/**
 * @swagger
 * /api/chat/itinerary:
 *   post:
 *     summary: Generar itinerario con IA
 *     tags: [Chat & AI]
 *     security:
 *       - bearerAuth: []
 *     description: Genera un itinerario de viaje personalizado usando inteligencia artificial basado en preferencias del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatItineraryRequest'
 *           example:
 *             destination: "París, Francia"
 *             duration: 7
 *             budget: 2000
 *             interests: ["arte", "historia", "gastronomía"]
 *             travelStyle: "cultural"
 *     responses:
 *       200:
 *         description: Itinerario generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 itinerary:
 *                   type: object
 *                   properties:
 *                     destination:
 *                       type: string
 *                     duration:
 *                       type: number
 *                     estimatedBudget:
 *                       type: number
 *                     days:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dayNumber:
 *                             type: number
 *                           theme:
 *                             type: string
 *                           activities:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 title:
 *                                   type: string
 *                                 description:
 *                                   type: string
 *                                 estimatedCost:
 *                                   type: number
 *                                 duration:
 *                                   type: string
 *                                 location:
 *                                   type: string
 *                 recommendations:
 *                   type: object
 *                   properties:
 *                     accommodation:
 *                       type: array
 *                       items:
 *                         type: string
 *                     transportation:
 *                       type: array
 *                       items:
 *                         type: string
 *                     tips:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servicio de IA
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/itinerary", authenticateJWT, getItinerary);

/**
 * @swagger
 * /api/chat/trip/{tripId}/itinerary:
 *   post:
 *     summary: Generar itinerario para viaje existente
 *     tags: [Chat & AI]
 *     security:
 *       - bearerAuth: []
 *     description: Genera o mejora el itinerario de un viaje existente usando IA
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del viaje
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: object
 *                 properties:
 *                   interests:
 *                     type: array
 *                     items:
 *                       type: string
 *                   budget:
 *                     type: number
 *                   travelStyle:
 *                     type: string
 *                     enum: ['budget', 'balanced', 'luxury', 'adventure', 'cultural', 'relaxation', 'business']
 *               regenerate:
 *                 type: boolean
 *                 description: Si regenerar completamente el itinerario
 *                 default: false
 *               specificRequests:
 *                 type: string
 *                 description: Solicitudes específicas para el itinerario
 *           example:
 *             preferences:
 *               interests: ["museos", "parques", "restaurantes locales"]
 *               budget: 1500
 *               travelStyle: "cultural"
 *             regenerate: false
 *             specificRequests: "Incluir más tiempo libre por las tardes"
 *     responses:
 *       200:
 *         description: Itinerario generado/actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Itinerario actualizado exitosamente"
 *                 trip:
 *                   $ref: '#/components/schemas/Trip'
 *                 aiResponse:
 *                   type: string
 *                   description: Explicación de los cambios realizados por la IA
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acceso denegado - No es el propietario del viaje
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Viaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servicio de IA
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/trip/:tripId/itinerary", authenticateJWT, generateTripItinerary);

/**
 * @swagger
 * /api/chat/assistant:
 *   post:
 *     summary: Chat con asistente de viajes IA
 *     tags: [Chat & AI]
 *     security:
 *       - bearerAuth: []
 *     description: Interactúa con el asistente de IA para obtener consejos, respuestas sobre viajes y asistencia general
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatAssistantRequest'
 *           example:
 *             message: "¿Cuál es la mejor época para visitar Japón?"
 *             context: "Estoy planeando un viaje cultural de 10 días"
 *     responses:
 *       200:
 *         description: Respuesta del asistente IA
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 response:
 *                   type: string
 *                   description: Respuesta del asistente de IA
 *                   example: "La mejor época para visitar Japón depende de tus preferencias..."
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Sugerencias adicionales relacionadas
 *                 relatedTopics:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Temas relacionados que podrían interesar
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token de autenticación requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Demasiadas solicitudes - Límite de rate limiting alcanzado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servicio de IA
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/assistant", authenticateJWT, chatAssistant);

export default router;
