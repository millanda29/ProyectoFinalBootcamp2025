import express from 'express';
import authController from './authController.js';
import { authenticateJWT } from './authMiddleware.js';
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.put('/change-password', authenticateJWT, authController.changePassword);

export default router;
