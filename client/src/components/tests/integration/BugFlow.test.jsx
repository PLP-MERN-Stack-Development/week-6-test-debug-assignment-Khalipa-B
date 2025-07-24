/* eslint-env jest */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import axios from 'axios';

// Only mock axios ONCE
jest.mock('axios');

describe('Bug Reporting Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('submits bug and shows it in list', async () => {
        axios.post.mockResolvedValue({
            data: { _id: '123', title: 'Test Bug', description: 'Details' },
        });
        axios.get.mockResolvedValue({ data: [{ _id: '123', title: 'Test Bug', description: 'Details' }] });

        render(<App />);

        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'Test Bug' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Details' },
        });
        fireEvent.click(screen.getByRole('button', { name: /add bug|submit/i }));

        await waitFor(() => {
            expect(screen.getByText(/test bug/i)).toBeInTheDocument();
        });
    });

    it('shows validation error if title is empty', async () => {
        axios.get.mockResolvedValue({ data: [] });
        render(<App />);

        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Missing title' },
        });
        fireEvent.click(screen.getByRole('button', { name: /add bug|submit/i }));

        await waitFor(() => {
            expect(screen.queryByText(/title is required/i)).toBeInTheDocument();
        });
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('fetches and displays existing bugs on load', async () => {
        axios.get.mockResolvedValue({
            data: [
                { _id: '1', title: 'Bug One', description: 'Desc One' },
                { _id: '2', title: 'Bug Two', description: 'Desc Two' },
            ],
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/bug one/i)).toBeInTheDocument();
            expect(screen.getByText(/bug two/i)).toBeInTheDocument();
        });
    });

    it('clears form fields after successful submission', async () => {
        axios.post.mockResolvedValue({
            data: { _id: '124', title: 'Clear Bug', description: 'Clear Desc' },
        });
        axios.get.mockResolvedValue({ data: [{ _id: '124', title: 'Clear Bug', description: 'Clear Desc' }] });

        render(<App />);

        const titleInput = screen.getByLabelText(/title/i);
        const descInput = screen.getByLabelText(/description/i);

        fireEvent.change(titleInput, { target: { value: 'Clear Bug' } });
        fireEvent.change(descInput, { target: { value: 'Clear Desc' } });
        fireEvent.click(screen.getByRole('button', { name: /add bug|submit/i }));

        await waitFor(() => {
            expect(titleInput.value).toBe('');
            expect(descInput.value).toBe('');
        });
    });

    it('does not submit if description is empty', async () => {
        axios.get.mockResolvedValue({ data: [] });
        render(<App />);

        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'No Description Bug' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByRole('button', { name: /add bug|submit/i }));

        await waitFor(() => {
            expect(screen.queryByText(/description is required/i)).toBeInTheDocument();
        });
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('displays loading indicator while fetching bugs', async () => {
        let resolvePromise;
        axios.get.mockReturnValue(
            new Promise((resolve) => {
                resolvePromise = resolve;
            })
        );

        render(<App />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        resolvePromise({ data: [] });
        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        });
    });

    it('displays error message if fetching bugs fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network error'));
        render(<App />);
        await waitFor(() => {
            expect(screen.getByText(/failed to fetch bugs/i)).toBeInTheDocument();
        });
    });

    it('displays error message if bug submission fails', async () => {
        axios.get.mockResolvedValue({ data: [] });
        axios.post.mockRejectedValueOnce(new Error('Submission error'));

        render(<App />);

        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'Fail Bug' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Fail Desc' },
        });
        fireEvent.click(screen.getByRole('button', { name: /add bug|submit/i }));

        await waitFor(() => {
            expect(screen.getByText(/failed to submit bug/i)).toBeInTheDocument();
        });
    });

    it('renders bug items with title and description', async () => {
        axios.get.mockResolvedValue({
            data: [
                { _id: '1', title: 'Bug Render', description: 'Render Desc' },
            ],
        });

        render(<App />);
        await waitFor(() => {
            expect(screen.getByText(/bug render/i)).toBeInTheDocument();
            expect(screen.getByText(/render desc/i)).toBeInTheDocument();
        });
    });
});

// We recommend installing an extension to run jest tests.
