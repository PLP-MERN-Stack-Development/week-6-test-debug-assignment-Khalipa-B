/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BugForm from '../../components/BugForm';

// Mock the createBug API
jest.mock('../../api/bugService', () => ({
    createBug: jest.fn(),
}));

import { createBug } from '../../api/bugService';

describe('BugForm Component', () => {
    it('renders form inputs', () => {
        render(<BugForm onBugAdded={jest.fn()} />);
        expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    });

    it('calls createBug and onBugAdded with form data', async () => {
        const mockBug = { id: 1, title: 'Bug A', description: 'Broken layout' };
        createBug.mockResolvedValueOnce({ data: mockBug });
        const handleBugAdded = jest.fn();

        render(<BugForm onBugAdded={handleBugAdded} />);

        fireEvent.change(screen.getByPlaceholderText(/title/i), {
            target: { value: 'Bug A' },
        });
        fireEvent.change(screen.getByPlaceholderText(/description/i), {
            target: { value: 'Broken layout' },
        });

        fireEvent.click(screen.getByRole('button', { name: /add bug/i }));

        await waitFor(() => {
            expect(createBug).toHaveBeenCalledWith({ title: 'Bug A', description: 'Broken layout' });
            expect(handleBugAdded).toHaveBeenCalledWith(mockBug);
        });
    });

    it('clears input fields after submit', async () => {
        createBug.mockResolvedValueOnce({ data: { id: 2, title: 'Bug B', description: 'UI issue' } });
        render(<BugForm onBugAdded={jest.fn()} />);

        const titleInput = screen.getByPlaceholderText(/title/i);
        const descInput = screen.getByPlaceholderText(/description/i);

        fireEvent.change(titleInput, { target: { value: 'Bug B' } });
        fireEvent.change(descInput, { target: { value: 'UI issue' } });

        fireEvent.click(screen.getByRole('button', { name: /add bug/i }));

        await waitFor(() => {
            expect(titleInput.value).toBe('');
            expect(descInput.value).toBe('');
        });
    });

    it('requires the title field', () => {
        render(<BugForm onBugAdded={jest.fn()} />);
        const titleInput = screen.getByPlaceholderText(/title/i);
        expect(titleInput).toBeRequired();
    });
});
