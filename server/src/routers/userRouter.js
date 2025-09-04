import express from 'express';
import userController from '../controllers/userController.js';
import { authenticateJWT } from '../auth/authMiddleware.js';
const router = express.Router();

/**
 * Rutas protegidas para usuario
 * authenticateJWT verifica token JWT
 */
router.get('/me', authenticateJWT, userController.getProfile);
router.put('/me', authenticateJWT, userController.updateProfile);
router.get('/me/trips', authenticateJWT, userController.getTravelHistory);
router.put('/me/change-password', authenticateJWT, userController.changePassword);

export default router;
