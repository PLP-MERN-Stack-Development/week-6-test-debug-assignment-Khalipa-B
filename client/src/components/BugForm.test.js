import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugForm from '../BugForm';

describe('BugForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  test('renders form fields correctly', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /create bug/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/reporter name is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates field lengths', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Test short title
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'AB'); // Too short

    const submitButton = screen.getByRole('button', { name: /create bug/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 3 characters long/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill form with valid data
    await user.type(screen.getByLabelText(/title/i), 'Test Bug Title');
    await user.type(screen.getByLabelText(/description/i), 'This is a detailed bug description');
    await user.selectOptions(screen.getByLabelText(/status/i), 'open');
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high');
    await user.type(screen.getByLabelText(/assignee/i), 'John Doe');
    await user.type(screen.getByLabelText(/reporter/i), 'Jane Smith');

    const submitButton = screen.getByRole('button', { name: /create bug/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug Title',
        description: 'This is a detailed bug description',
        status: 'open',
        priority: 'high',
        assignee: 'John Doe',
        reporter: 'Jane Smith'
      });
    });
  });

  test('populates form when editing existing bug', () => {
    const existingBug = {
      _id: '1',
      title: 'Existing Bug',
      description: 'Existing description',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Bob Wilson',
      reporter: 'Alice Brown'
    };

    render(<BugForm bug={existingBug} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByDisplayValue('Existing Bug')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('in-progress')).toBeInTheDocument();
    expect(screen.getByDisplayValue('medium')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bob Wilson')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice Brown')).toBeInTheDocument();
  });

  test('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('disables form when loading', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={true} />);

    const submitButton = screen.getByRole('button', { name: /create bug/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });
});