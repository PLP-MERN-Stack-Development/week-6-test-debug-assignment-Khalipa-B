import { rest } from 'msw';

const API_URL = 'http://localhost:5000/api';

export const handlers = [
  // Get all bugs
  rest.get(`${API_URL}/bugs`, (req, res, ctx) => {
    const mockBugs = [
      {
        _id: '1',
        title: 'Test Bug 1',
        description: 'This is a test bug description',
        status: 'open',
        priority: 'high',
        assignee: 'John Doe',
        reporter: 'Jane Smith',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      },
      {
        _id: '2',
        title: 'Test Bug 2',
        description: 'Another test bug description',
        status: 'in-progress',
        priority: 'medium',
        assignee: 'Bob Wilson',
        reporter: 'Alice Brown',
        createdAt: '2023-01-02T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z'
      }
    ];

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockBugs,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalBugs: 2,
          hasNext: false,
          hasPrev: false
        }
      })
    );
  }),

  // Get bug stats
  rest.get(`${API_URL}/bugs/stats`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          totalBugs: 10,
          openBugs: 3,
          inProgressBugs: 4,
          resolvedBugs: 3,
          criticalBugs: 1,
          highPriorityBugs: 2
        }
      })
    );
  }),

  // Create bug
  rest.post(`${API_URL}/bugs`, (req, res, ctx) => {
    const newBug = {
      _id: 'new-bug-id',
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        message: 'Bug created successfully',
        data: newBug
      })
    );
  }),

  // Update bug
  rest.put(`${API_URL}/bugs/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const updatedBug = {
      _id: id,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Bug updated successfully',
        data: updatedBug
      })
    );
  }),

  // Delete bug
  rest.delete(`${API_URL}/bugs/:id`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Bug deleted successfully'
      })
    );
  }),

  // Error scenarios
  rest.post(`${API_URL}/bugs/error`, (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        success: false,
        message: 'Validation failed',
        errors: [
          { field: 'title', message: 'Title is required' }
        ]
      })
    );
  })
];