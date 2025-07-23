const request = require('supertest');
const app = require('../app');
const Bug = require('../models/Bug');

describe('Bug API', () => {
  it('should create a bug', async () => {
    const res = await request(app).post('/api/bugs').send({ title: 'Bug A', status: 'open' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe('Bug A');
  });
});
