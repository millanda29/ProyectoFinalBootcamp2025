const express = require('express');
const tripController = require('../controllers/tripController');

const router = express.Router();

// Ejemplo de rutas para viajes
router.get('/', tripController.getAllTrips);
router.post('/', tripController.createTrip);

export default router;