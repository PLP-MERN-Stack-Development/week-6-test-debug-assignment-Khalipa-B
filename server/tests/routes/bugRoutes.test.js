const request = require('supertest');
const app = require('../../server');
const Bug = require('../../models/Bug');

describe('Bug Routes', () => {
  const validBugData = {
    title: 'Test Bug',
    description: 'This is a test bug description that is long enough to pass validation',
    status: 'open',
    priority: 'medium',
    assignee: 'John Doe',
    reporter: 'Jane Smith'
  };

  describe('POST /api/bugs', () => {
    test('should create a new bug with valid data', async () => {
      const response = await request(app)
        .post('/api/bugs')
        .send(validBugData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bug created successfully');
      expect(response.body.data).toMatchObject({
        title: validBugData.title,
        description: validBugData.description,
        status: validBugData.status,
        priority: validBugData.priority,
        assignee: validBugData.assignee,
        reporter: validBugData.reporter
      });
      expect(response.body.data._id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
    });

    test('should fail to create bug with invalid data', async () => {
      const invalidData = { ...validBugData };
      delete invalidData.title;

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
    });

    test('should sanitize input data', async () => {
      const maliciousData = {
        ...validBugData,
        title: 'Test <script>alert("xss")</script> Bug',
        description: 'This is a test javascript:alert("xss") description that is long enough'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(maliciousData)
        .expect(201);

      expect(response.body.data.title).toBe('Test  Bug');
      expect(response.body.data.description).toContain('This is a test alert("xss") description');
    });
  });

  describe('GET /api/bugs', () => {
    beforeEach(async () => {
      // Create test bugs
      await Bug.create([
        { ...validBugData, title: 'Bug 1', status: 'open', priority: 'high' },
        { ...validBugData, title: 'Bug 2', status: 'in-progress', priority: 'medium' },
        { ...validBugData, title: 'Bug 3', status: 'resolved', priority: 'low' },
      ]);
    });

    test('