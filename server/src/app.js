import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import listEndpoints from 'express-list-endpoints'; // 👈 paquete para listar rutas
import router from './routers/index.js';
import authRouter from './auth/authRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import { startScheduledDeletionTask } from './tasks/scheduledDeletions.js';
import { specs, swaggerUi } from './config/swagger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORS = process.env.CORS_ORIGIN || 'http://localhost:5173';
const app = express();

const allowedOrigins = [CORS];

// Configuración de CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(morgan('dev'));

// Servir archivos estáticos para reportes PDF
app.use('/reports', express.static(path.join(__dirname, '../reports')));

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Travel Management API Documentation'
}));

// Rutas principales
app.use('/api', router);
app.use('/api/auth', authRouter);

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Endpoints del sistema y utilidades
 */

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Listar todas las rutas de la aplicación
 *     tags: [System]
 *     security: []
 *     description: Genera un listado de todas las rutas registradas en Express con sus métodos HTTP permitidos
 *     responses:
 *       200:
 *         description: Lista de todas las rutas disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   path:
 *                     type: string
 *                     description: Ruta del endpoint
 *                     example: "/api/auth/login"
 *                   methods:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Métodos HTTP permitidos
 *                     example: ["POST"]
 *                   middlewares:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Middlewares aplicados
 */
app.get('/api/routes', (req, res) => {
  /**
   * Genera un listado de todas las rutas registradas en Express
   * Incluye paths y métodos permitidos
   */
  const endpoints = listEndpoints(app);
  res.status(200).json(endpoints);
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificar estado de salud de la API
 *     tags: [System]
 *     security: []
 *     description: Endpoint para verificar que la API está funcionando correctamente
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "API funcionando correctamente"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00Z"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Middleware de errores
app.use(errorHandler);

// Inicializar tareas programadas
startScheduledDeletionTask();

export default app;
