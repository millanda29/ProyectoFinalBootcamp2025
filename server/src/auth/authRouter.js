import express from 'express';
import authController from './authController.js';
const router = express.Router();

/**
 * Rutas de autenticación
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
