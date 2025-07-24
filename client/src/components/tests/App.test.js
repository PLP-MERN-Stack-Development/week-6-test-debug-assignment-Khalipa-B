import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('App Integration Tests', () => {
  test('renders navigation and dashboard by default', async () => {
    render(<App />);

    expect(screen.getByText('Bug Tracker')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('All Bugs')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Overview of your bug tracking system')).toBeInTheDocument();
    });
  });

  test('navigates to bugs page', async () => {
    const user = userEvent.setup();
    render(<App />);

    const bugsLink = screen.getByText('All Bugs');
    await user.click(bugsLink);

    await waitFor(() => {
      expect(screen.getByText('Bug Reports')).toBeInTheDocument();
      expect(screen.getByText('Manage and track all reported bugs in your system.')).toBeInTheDocument();
    });
  });

  test('opens bug form when report bug button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to bugs page
    const bugsLink = screen.getByText('All Bugs');
    await user.click(bugsLink);

    await waitFor(() => {
      expect(screen.getByText('Report Bug')).toBeInTheDocument();
    });

    // Click report bug button
    const reportButton = screen.getByText('Report Bug');
    await user.click(reportButton);

    await waitFor(() => {
      expect(screen.getByText('Report New Bug')).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });
  });

  test('displays bug list from API', async () => {
    render(<App />);

    // Navigate to bugs page
    const bugsLink = screen.getByText('All Bugs');
    await userEvent.click(bugsLink);

    // Wait for bugs to load
    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    });
  });

  test('filters bugs by status', async () => {
    const user = userEvent.should validate valid bug data', () => {
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