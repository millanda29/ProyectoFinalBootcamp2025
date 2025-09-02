import express from 'express';
import authRouter from '../auth/authRouter.js';
import userController from '../controllers/userController.js';

const router = express.Router();

// Rutas de autenticación (registro, login, etc)
router.use('/', authRouter);

// Ejemplo de ruta protegida para obtener perfil
router.get('/me', userController.getUserProfile);

export default router;