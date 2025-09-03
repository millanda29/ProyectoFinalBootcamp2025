import express from 'express';
import tripController from '../controllers/tripController.js';

const router = express.Router();

router.get('/', tripController.getAllTrips);
router.post('/', tripController.createTrip);
router.get('/:id', tripController.getTripById);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

export default router;
