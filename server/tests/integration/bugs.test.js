require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

const Bug = require('../../models/Bug');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /api/bugs', () => {
  it('should create a bug with valid data', async () => {
    const res = await request(app).post('/api/bugs').send({
      title: 'UI bug',
      description: 'Submit button not working',
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('UI bug');
  });

  it('should fail with missing data', async () => {
    const res = await request(app).post('/api/bugs').send({});
    expect(res.status).toBe(400);
  });
});

mongoServer = await MongoMemoryServer.create({
  binary: { version: '8.0.0' } 
});
