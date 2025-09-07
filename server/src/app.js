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

// Rutas principales
app.use('/api', router);
app.use('/api/auth', authRouter);

// ✅ Endpoint para listar todas las rutas de la aplicación
app.get('/api/routes', (req, res) => {
  /**
   * Genera un listado de todas las rutas registradas en Express
   * Incluye paths y métodos permitidos
   */
  const endpoints = listEndpoints(app);
  res.status(200).json(endpoints);
});

// Middleware de errores
app.use(errorHandler);

// Inicializar tareas programadas
startScheduledDeletionTask();

export default app;
