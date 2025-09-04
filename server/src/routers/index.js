import express from 'express';
import userRouter from './userRouter.js';
import tripRouter from './tripRouter.js';
import chatRouter from "./chatRouter.js";

const router = express.Router();

router.use('/users', userRouter);
router.use('/trips', tripRouter);
router.use('/chat', chatRouter);

export default router;
