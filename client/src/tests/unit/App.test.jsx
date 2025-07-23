import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App';
import React from 'react';

// Mock the bugService API
jest.mock('../../api/bugService', () => ({
    getBugs: jest.fn(),
}));

import { getBugs } from '../../api/bugService';

describe('App Component', () => {
    beforeEach(() => {
        getBugs.mockClear();
    });

    test('renders app heading', () => {
        render(<App />);
        const heading = screen.getByText(/Bug Tracker/i);
        expect(heading).toBeInTheDocument();
    });

    test('fetches and displays bugs from API', async () => {
        getBugs.mockResolvedValueOnce({
            data: [
                { id: 1, title: 'Bug 1', description: 'Desc 1' },
                { id: 2, title: 'Bug 2', description: 'Desc 2' },
            ],
        });

        render(<App />);
        await waitFor(() => {
            expect(screen.getByText('Bug 1')).toBeInTheDocument();
            expect(screen.getByText('Bug 2')).toBeInTheDocument();
        });
    });

    test('renders BugForm and BugList components', () => {
        getBugs.mockResolvedValueOnce({ data: [] });
        render(<App />);
        expect(screen.getByRole('button', { name: /add bug/i })).toBeInTheDocument();
    });
});

// We recommend installing an extension to run jest tests.
