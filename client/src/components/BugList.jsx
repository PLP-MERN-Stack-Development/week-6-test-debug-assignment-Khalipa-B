import React, { useState } from 'react';

const BugList = ({ bugs, onEdit, onDelete, loading }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bug?')) {
      return;
    }

    try {
      setDeletingId(id);
      await onDelete(id);
    } catch (error) {
      console.error('Error deleting bug:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bugs.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No bugs found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new bug report.
        </p>
      </div>
    );
  }

  return (
    <div className="space-yshould validate valid bug data', () => {
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
