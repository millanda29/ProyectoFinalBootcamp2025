import 'dotenv/config';
import app from './src/app.js';
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./src/auth/authRouter');
const errorHandler = require('./src/middlewares/errorHandler');


dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use('/api/auth', authRouter);
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to the database');
})
.catch(err => {
    console.error('Database connection error:', err);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});