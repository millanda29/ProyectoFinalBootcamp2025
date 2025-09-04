/*import express from 'express';
import tripController from '../controllers/tripController.js';
import authMiddleware from '../auth/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

// Historial del usuario autenticado
router.get('/my', authMiddleware, tripController.getMyTrips);

// Solo admin puede ver todos los viajes
router.get('/', authMiddleware, isAdmin, tripController.getAllTrips);

// CRUD de viajes
router.post('/', authMiddleware, tripController.createTrip);
router.get('/:id', authMiddleware, tripController.getTripById);
router.put('/:id', authMiddleware, tripController.updateTrip);
router.delete('/:id', authMiddleware, tripController.deleteTrip);

export default router;
*/