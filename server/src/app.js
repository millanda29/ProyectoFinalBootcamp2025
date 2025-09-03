import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routers/index.js';
import authRouter from './auth/authRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', router);
app.use('/api/auth', authRouter);

app.use(errorHandler);

export default app;
