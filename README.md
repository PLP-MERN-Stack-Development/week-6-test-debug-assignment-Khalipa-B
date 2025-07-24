# MERN Bug Tracker

A comprehensive bug tracking application built with the MERN stack, featuring extensive testing and debugging capabilities.

## Features

- Complete CRUD operations for bug reports
- Advanced filtering and sorting
- Real-time statistics dashboard
- Comprehensive test coverage (Unit + Integration)
- Advanced debugging and error handling
- Responsive design
- Performance optimized

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Jest** - Testing framework
- **Supertest** - API testing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **React Testing Library** - Component testing
- **MSW** - API mocking

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/Khalipa-B/mern-bug-tracker.git
cd mern-bug-tracker

Backend Setup
bashcd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
Frontend Setup
bashcd frontend
npm install
npm start
Database Setup
Make sure MongoDB is running on your system. The application will create the database automatically.
Running Tests
Backend Tests
bashcd backend
npm test                    # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
Frontend Tests
bashcd frontend
npm test                   # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
Debugging
Backend Debugging
Using Node.js Inspector
bashcd backend
npm run debug
Then open Chrome and go to chrome://inspect
Using VSCode

Set breakpoints in your code
Press F5 or use the Debug panel
Select "Debug Backend" configuration

Debug Logs
Enable debug logs by setting environment variable:
bashDEBUG=app:* npm run dev
Frontend Debugging
React DevTools
Install the React Developer Tools browser extension for component inspection.
Redux DevTools (if using Redux)
Install Redux DevTools extension for state debugging.
Using VSCode

Set breakpoints in your code
Press F5 or use the Debug panel
Select "Debug Frontend" configuration

Network Debugging
Use browser DevTools Network tab to inspect API calls and responses.
API Documentation
Base URL
http://localhost:5000/api
Endpoints
Bugs

GET /bugs - Get all bugs with optional filtering
GET /bugs/:id - Get bug by ID
POST /bugs - Create new bug
PUT /bugs/:id - Update bug
DELETE /bugs/:id - Delete bug
GET /bugs/stats - Get bug statistics

Query Parameters (GET /bugs)

status - Filter by status (open, in-progress, resolved)
priority - Filter by priority (low, medium, high, critical)
page - Page number for pagination (default: 1)
limit - Items per page (default: 10)
sortBy - Sort field (default: createdAt)
order - Sort order (asc, desc) (default: desc)

Request/Response Examples
Create Bug
bashPOST /api/bugs
Content-Type: application/json

{
  "title": "Login button not working",
  "description": "The login button on the homepage is not responding to clicks",
  "status": "open",
  "priority": "high",
  "assignee": "John Doe",
  "reporter": "Jane Smith"
}
Response
json{
  "success": true,
  "message": "Bug created successfully",
  "data": {
    "_id": "64f1234567890abcdef12345",
    "title": "Login button not working",
    "description": "The login button on the homepage is not responding to clicks",
    "status": "open",
    "priority": "high",
    "assignee": "John Doe",
    "reporter": "Jane Smith",
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T10:00:00.000Z"
  }
}
Testing Strategy
Backend Testing
Unit Tests

Validation functions
Helper utilities
Database models

Integration Tests

API endpoints
Database operations
Error handling

Test Files Location
backend/tests/
├── setup.js                 # Test configuration
├── utils/
│   └── validation.test.js    # Validation tests
└── routes/
    └── bugRoutes.test.js     # API tests
Frontend Testing
Unit Tests

Component rendering
Form validation
Utility functions

Integration Tests

API integration
User interactions
Navigation flow

Test Files Location
frontend/src/
├── __tests__/
├── components/__tests__/
├── hooks/__tests__/
└── mocks/
    ├── handlers.js          # MSW handlers
    └── server.js           # MSW server
Error Handling
Backend Error Handling

Global error middleware
Custom error classes
Structured error responses
Request logging

Frontend Error Handling

Error boundaries for React components
API error handling
User-friendly error messages
Error logging and reporting

Performance Optimization
Backend

Database indexing
Query optimization
Caching strategies
Rate limiting

Frontend

Code splitting
Lazy loading
Memoization
Bundle optimization

Deployment
Environment Variables
Backend (.env)
envNODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bugtracker
Frontend (.env)
envREACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENV=production
Production Build
bash# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
Contributing

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

Testing Checklist

 All unit tests pass
 All integration tests pass
 Code coverage > 80%
 API endpoints tested
 Form validation tested
 Error scenarios tested
 Accessibility tested

License
This project is licensed under the MIT License - see the LICENSE.md file for details.
Support
If you encounter any issues or have questions, please file an issue on GitHub or contact the development team.

This comprehensive implementation provides:

1. **Complete MERN Stack Setup** with proper project structure
2. **Extensive Testing** covering unit, integration, and component tests
3. **Advanced Debugging** with error boundaries, logging, and debugging utilities
4. **Production-Ready Code** with error handling, validation, and performance optimization
5. **Comprehensive Documentation** with setup instructions and API documentation

The application demonstrates best practices for testing and debugging in MERN applications, making it an excellent learning resource for developers.should validate valid bug data', () => {
      const { error, value } = validateBug(validBugData);
      expect(error).toBeUndefined();
      expect(value).toMatchObject(validBugData);
    });

    test('should fail validation for missing title', () => {
      const invalidData = { ...validBugData };
      delete invalidData.title;
      
      const { error } = validateBug(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('title');
    });

    test('should fail validation for short title', () => {
      const invalidData = { ...validBugData, title: 'AB' };
      
      const { error } = validateBug(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('at least 3 characters');
    });

    test('should fail validation for long title', () => {
      const invalidData = { ...validBugData, title: 'A'.repeat(101) };
      
      const { error } = validateBug(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('cannot exceed 100 characters');
    });

    test('should fail validation for missing description', () => {
      const invalidData = { ...validBugData };
      delete invalidData.description;
      
      const { error } = validateBug(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('description');
    });

    test('should fail validation for short description', () => {
      const invalidData = { ...validBugData, description: 'Short' };
      
      const { error } = validateBug(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('at least 10 characters');
    });

    test('should fail validation for invalid status', () => {
      const invalidData = { ...validBugData, status: 'invalid-status' };
      
      const { error } = validateBug(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('status');
    });

    test('should fail validation for invalid priority', () => {
      const invalidData = { ...validBugData, priority: 'invalid-priority' };
      
      const { error } = validateBug(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('priority');
    });

    test('should set default values for optional fields', () => {
      const minimalData = {
        title: 'Test Bug',
        description: 'This is a test bug description that is long enough',
        reporter: 'Jane Smith'
      };
      
      const { error, value } = validateBug(minimalData);
      expect(error).toBeUndefined();
      expect(value.status).toBe('open');
      expect(value.priority).toBe('medium');
    });
  });

  describe('sanitizeInput', () => {
    test('should remove script tags', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello  World');
    });

    test('should remove javascript: protocols', () => {
      const input = 'javascript:alert("xss")';
      const result = sanitizeInput(input);
      expect(result).toBe('alert("xss")');
    });

    test('should trim whitespace', () => {
      const input = '  Hello World  ';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello World');
    });

    test('should handle non-string input', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
      expect(sanitizeInput(undefined)).toBe(undefined);
    });
  });

  describe('isValidObjectId', () => {
    test('should return true for valid ObjectId', () => {
      expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
      expect(isValidObjectId('507f1f77bcf86cd799439012')).toBe(true);
    });

    test('should return false for invalid ObjectId', () => {
      expect(isValidObjectId('invalid')).toBe(false);
      expect(isValidObjectId('507f1f77bcf86cd79943901')).toBe(false); // too short
      expect(isValidObjectId('507f1f77bcf86cd7994390111')).toBe(false); // too long
      expect(isValidObjectId('507f1f77bcf86cd79943901g')).toBe(false); // invalid character
    });

    test('should handle non-string input', () => {
      expect(isValidObjectId(null)).toBe(false);
      expect(isValidObjectId(undefined)).toBe(false);
      expect(isValidObjectId(123)).toBe(false);
    });
  });
});