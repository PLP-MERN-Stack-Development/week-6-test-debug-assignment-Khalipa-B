const express = require('express');
const bugRoutes = require('./routes/bugRoutes');
const { errorHandler } = require('../middleware/errorMiddleware');

const app = express();
app.use(express.json());
app.use(bugRoutes); // or app.use('/api/bugs', bugRoutes);
app.use(errorHandler);

module.exports = app;