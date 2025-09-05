import express from 'express';
import userController from '../controllers/userController.js';
import { authenticateJWT } from '../auth/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

/**
 * Rutas protegidas para usuario
 * authenticateJWT verifica token JWT
 */
router.get('/me', authenticateJWT, userController.getProfile);
router.get('/me/full', authenticateJWT, userController.getFullProfile);
router.put('/me', authenticateJWT, userController.updateProfile);
router.get('/me/trips', authenticateJWT, userController.getTravelHistory);
router.put('/me/change-password', authenticateJWT, userController.changePassword);

// Gestión de cuenta
router.post('/me/schedule-deletion', authenticateJWT, userController.requestAccountDeletion);
router.delete('/me/cancel-deletion', authenticateJWT, userController.cancelAccountDeletion);
router.delete('/me', authenticateJWT, userController.deleteMyAccount);

// Preferencias y configuración
router.put('/me/preferences', authenticateJWT, userController.updateTravelPreferences);
router.put('/me/notifications', authenticateJWT, userController.updateNotifications);
router.put('/me/stats', authenticateJWT, userController.updateStats);

// Búsqueda de usuarios similares
router.get('/similar', authenticateJWT, userController.findSimilarUsers);

/**
 * Rutas de administración (solo admin)
 */
router.get('/admin/stats', authenticateJWT, isAdmin, userController.getStats);
router.get('/admin/all', authenticateJWT, isAdmin, userController.getAllUsers);
router.post('/admin/create', authenticateJWT, isAdmin, userController.createUser);
router.get('/admin/:id', authenticateJWT, isAdmin, userController.getUserById);
router.put('/admin/:id', authenticateJWT, isAdmin, userController.updateUser);
router.delete('/admin/:id', authenticateJWT, isAdmin, userController.deleteUser);
router.put('/admin/:id/reset-password', authenticateJWT, isAdmin, userController.resetPassword);

export default router;
