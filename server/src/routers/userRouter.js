import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../auth/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

// Rutas protegidas
router.get('/me', authMiddleware, userController.getUserProfile);
router.put('/me', authMiddleware, userController.updateUserProfile);

export default router;
