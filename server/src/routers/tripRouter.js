import express from 'express';
import tripController from '../controllers/tripController.js';
import { authenticateJWT } from '../auth/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

// Historial del usuario autenticado
router.get('/my', authenticateJWT, tripController.getMyTrips);

// Solo admin puede ver todos los viajes
router.get('/', authenticateJWT, isAdmin, tripController.getAllTrips);

// CRUD de viajes
router.post('/', authenticateJWT, tripController.createTrip);
router.get('/:id', authenticateJWT, tripController.getTripById);
router.put('/:id', authenticateJWT, tripController.updateTrip);
router.delete('/:id', authenticateJWT, tripController.deleteTrip);

// Rutas específicas para funcionalidades avanzadas
router.put('/:id/costs', authenticateJWT, tripController.addCosts);
router.put('/:id/itinerary', authenticateJWT, tripController.updateItinerary);

// Rutas para reportes
router.post('/:id/report', authenticateJWT, tripController.generateReport);
router.get('/:id/reports', authenticateJWT, tripController.getTripReports);

export default router;