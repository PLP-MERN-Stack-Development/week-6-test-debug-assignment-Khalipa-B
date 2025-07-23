require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bugRoutes = require('../routes/bugRoutes');
const { errorHandler } = require('../middleware/errorMiddleware');
const app = require('../app');


const app = express();
app.use(express.json());
app.use('/api/bugs', bugRoutes);
app.use(errorHandler);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Bug Routes', () => {
  it('GET /api/bugs - should return bugs', async () => {
    const res = await request(app).get('/api/bugs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
