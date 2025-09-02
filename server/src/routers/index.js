import express from 'express';
import userRouter from './userRouter.js';
import tripRouter from './tripRouter.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/trips', tripRouter);

export default router;