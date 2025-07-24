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

    test('should get all bugs', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('status');
      expect(response.body.data[0]).toHaveProperty('priority');
    });

    test('should filter bugs by status', async () => {
      const response = await request(app)
        .get('/api/bugs?status=open')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('open');
    });

    test('should filter bugs by priority', async () => {
      const response = await request(app)
        .get('/api/bugs?priority=high')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].priority).toBe('high');
    });

    test('should filter bugs by assignee', async () => {
      const response = await request(app)
        .get('/api/bugs?assignee=John Doe')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      response.body.data.forEach(bug => {
        expect(bug.assignee).toBe('John Doe');
      });
    });

    test('should sort bugs by createdAt desc by default', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      const dates = response.body.data.map(bug => new Date(bug.createdAt));
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i-1].getTime()).toBeGreaterThanOrEqual(dates[i].getTime());
      }
    });

    test('should handle pagination', async () => {
      const response = await request(app)
        .get('/api/bugs?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(2);
      expect(response.body.pagination.totalItems).toBe(3);
    });

    test('should return empty array when no bugs found', async () => {
      await Bug.deleteMany({});

      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create(validBugData);
      bugId = bug._id.toString();
    });

    test('should get a bug by id', async () => {
      const response = await request(app)
        .get(`/api/bugs/${bugId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(bugId);
      expect(response.body.data.title).toBe(validBugData.title);
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });

    test('should return 400 for invalid bug id', async () => {
      const response = await request(app)
        .get('/api/bugs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid bug ID');
    });
  });

  describe('PUT /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create(validBugData);
      bugId = bug._id.toString();
    });

    test('should update a bug with valid data', async () => {
      const updateData = {
        title: 'Updated Bug Title',
        status: 'in-progress',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bug updated successfully');
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.priority).toBe(updateData.priority);
      expect(response.body.data.updatedAt).toBeDefined();
    });

    test('should sanitize update data', async () => {
      const maliciousUpdate = {
        title: 'Updated <script>alert("xss")</script> Title',
        description: 'Updated javascript:alert("xss") description'
      };

      const response = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(maliciousUpdate)
        .expect(200);

      expect(response.body.data.title).toBe('Updated  Title');
      expect(response.body.data.description).toContain('Updated alert("xss") description');
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });

    test('should validate update data', async () => {
      const invalidUpdate = {
        status: 'invalid-status',
        priority: 'invalid-priority'
      };

      const response = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    test('should return 400 for invalid bug id', async () => {
      const response = await request(app)
        .put('/api/bugs/invalid-id')
        .send({ title: 'Updated Title' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid bug ID');
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create(validBugData);
      bugId = bug._id.toString();
    });

    test('should delete a bug', async () => {
      const response = await request(app)
        .delete(`/api/bugs/${bugId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bug deleted successfully');

      // Verify bug is actually deleted
      const deletedBug = await Bug.findById(bugId);
      expect(deletedBug).toBeNull();
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });

    test('should return 400 for invalid bug id', async () => {
      const response = await request(app)
        .delete('/api/bugs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid bug ID');
    });
  });

  describe('PATCH /api/bugs/:id/status', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create(validBugData);
      bugId = bug._id.toString();
    });

    test('should update bug status', async () => {
      const response = await request(app)
        .patch(`/api/bugs/${bugId}/status`)
        .send({ status: 'resolved' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bug status updated successfully');
      expect(response.body.data.status).toBe('resolved');
      expect(response.body.data.updatedAt).toBeDefined();
    });

    test('should validate status value', async () => {
      const response = await request(app)
        .patch(`/api/bugs/${bugId}/status`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid status value');
    });

    test('should require status field', async () => {
      const response = await request(app)
        .patch(`/api/bugs/${bugId}/status`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Status is required');
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .patch(`/api/bugs/${fakeId}/status`)
        .send({ status: 'resolved' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });
  });

  describe('GET /api/bugs/stats', () => {
    beforeEach(async () => {
      await Bug.create([
        { ...validBugData, status: 'open', priority: 'high' },
        { ...validBugData, status: 'open', priority: 'medium' },
        { ...validBugData, status: 'in-progress', priority: 'high' },
        { ...validBugData, status: 'resolved', priority: 'low' },
        { ...validBugData, status: 'resolved', priority: 'medium' }
      ]);
    });

    test('should return bug statistics', async () => {
      const response = await request(app)
        .get('/api/bugs/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        totalBugs: 5,
        byStatus: {
          open: 2,
          'in-progress': 1,
          resolved: 2
        },
        byPriority: {
          high: 2,
          medium: 2,
          low: 1
        }
      });
    });

    test('should return zero stats when no bugs exist', async () => {
      await Bug.deleteMany({});

      const response = await request(app)
        .get('/api/bugs/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalBugs).toBe(0);
    });
  });

  // Test setup and teardown
  beforeAll(async () => {
    // Connect to test database or use in-memory database
    // This setup depends on your testing configuration
  });

  afterAll(async () => {
    // Close database connection
    // This cleanup depends on your testing configuration
  });

  beforeEach(async () => {
    // Clean up database before each test
    await Bug.deleteMany({});
  });

  afterEach(async () => {
    // Additional cleanup if needed
    jest.clearAllMocks();
  });
});