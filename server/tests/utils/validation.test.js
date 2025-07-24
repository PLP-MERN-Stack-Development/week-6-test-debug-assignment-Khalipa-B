const request = require('supertest');
const app = require('../app'); // path may vary
const { validateBug, sanitizeInput, isValidObjectId } = require('../../utils/validation');

describe('Validation Utils', () => {
  describe('validateBug', () => {
    const validBugData = {
      title: 'Test Bug',
      description: 'This is a test bug description that is long enough',
      status: 'open',
      priority: 'medium',
      assignee: 'John Doe',
      reporter: 'Jane Smith'
    };

    test('should get all bugs', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.totalBugs).toBe(3);
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

    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/bugs?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(2);
    });

    test('should support sorting', async () => {
      const response = await request(app)
        .get('/api/bugs?sortBy=title&order=asc')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].title).toBe('Bug 1');
      expect(response.body.data[1].title).toBe('Bug 2');
    });
  });

  describe('GET /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create(validBugData);
      bugId = bug._id.toString();
    });

    test('should get bug by valid ID', async () => {
      const response = await request(app)
        .get(`/api/bugs/${bugId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(bugId);
      expect(response.body.data.title).toBe(validBugData.title);
    });

    test('should return 404 for non-existent bug', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/bugs/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/bugs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid bug ID format');
    });
  });

  describe('PUT /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create(validBugData);
      bugId = bug._id.toString();
    });

    test('should update bug with valid data', async () => {
      const updateData = {
        ...validBugData,
        title: 'Updated Bug Title',
        status: 'in-progress'
      };

      const response = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bug updated successfully');
      expect(response.body.data.title).toBe('Updated Bug Title');
      expect(response.body.data.status).toBe('in-progress');
    });

    test('should fail to update with invalid data', async () => {
      const invalidData = { ...validBugData, title: '' };

      const response = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    test('should return 404 for non-existent bug', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/bugs/${nonExistentId}`)
        .send(validBugData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create(validBugData);
      bugId = bug._id.toString();
    });

    test('should delete bug successfully', async () => {
      const response = await request(app)
        .delete(`/api/bugs/${bugId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bug deleted successfully');

      // Verify bug is deleted
      const deletedBug = await Bug.findById(bugId);
      expect(deletedBug).toBeNull();
    });

    test('should return 404 for non-existent bug', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/bugs/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
    });
  });

  describe('GET /api/bugs/stats', () => {
    beforeEach(async () => {
      await Bug.create([
        { ...validBugData, status: 'open', priority: 'critical' },
        { ...validBugData, status: 'open', priority: 'high' },
        { ...validBugData, status: 'in-progress', priority: 'medium' },
        { ...validBugData, status: 'resolved', priority: 'low' },
      ]);
    });

    test('should return bug statistics', async () => {
      const response = await request(app)
        .get('/api/bugs/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        totalBugs: 4,
        openBugs: 2,
        inProgressBugs: 1,
        resolvedBugs: 1,
        criticalBugs: 1,
        highPriorityBugs: 1
      });
    });
  });
});