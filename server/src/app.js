import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import router from './routers/index.js';
import authRouter from './auth/authRouter.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const CORS = process.env.CORS_ORIGIN || 'http://localhost:5173';
const app = express();

const allowedOrigins = [CORS];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api', router);
app.use('/api/auth', authRouter);

// Middleware de errores
app.use(errorHandler);

export default app;
