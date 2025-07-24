import { renderHook, act, waitFor } from '@testing-library/react';
import { useBugs, useBugStats } from '../useBugs';
import { server } from '../../mocks/server';
import { rest } from 'msw';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useBugs Hook', () => {
  test('fetches bugs on mount', async () => {
    const { result } = renderHook(() => useBugs());

    expect(result.current.loading).toBe(true);
    expect(result.current.bugs).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bugs).toHaveLength(2);
    expect(result.current.bugs[0].title).toBe('Test Bug 1');
  });

  test('creates a new bug', async () => {
    const { result } = renderHook(() => useBugs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newBugData = {
      title: 'New Bug',
      description: 'New bug description that is long enough',
      status: 'open',
      priority: 'medium',
      assignee: 'John Doe',
      reporter: 'Jane Smith'
    };

    await act(async () => {
      await result.current.createBug(newBugData);
    });

    expect(result.current.bugs).toHaveLength(3);
    expect(result.current.bugs[0].title).toBe('New Bug');
  });

  test('updates a bug', async () => {
    const { result } = renderHook(() => useBugs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updateData = {
      title: 'Updated Bug Title',
      description: 'Updated description that is long enough',
      status: 'in-progress',
      priority: 'high',
      assignee: 'John Doe',
      reporter: 'Jane Smith'
    };

    await act(async () => {
      await result.current.updateBug('1', updateData);
    });

    const updatedBug = result.current.bugs.find(bug => bug._id === '1');
    expect(updatedBug.title).toBe('Updated Bug Title');
    expect(updatedBug.status).toBe('in-progress');
  });

  test('deletes a bug', async () => {
    const { result } = renderHook(() => useBugs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bugs).toHaveLength(2);

    await act(async () => {
      await result.current.deleteBug('1');
    });

    expect(result.current.bugs).toHaveLength(1);
    expect(result.current.bugs.find(bug => bug._id === '1')).toBeUndefined();
  });

  test('handles API errors', async () => {
    // Override the default handler to return an error
    server.use(
      rest.get('http://localhost:5000/api/bugs', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ success: false, message: 'Server error' })
        );
      })
    );

    const { result } = renderHook(() => useBugs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Server error');
    expect(result.current.bugs).toEqual([]);
  });

  test('refetches bugs when refetch is called', async () => {
    const { result } = renderHook(() => useBugs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bugs).toHaveLength(2);

    await act(async () => {
      result.current.refetch();
    });

    // Should still have the same bugs after refetch
    expect(result.current.bugs).toHaveLength(2);
  });
});

describe('useBugStats Hook', () => {
  test('fetches bug statistics on mount', async () => {
    const { result } = renderHook(() => useBugStats());

    expect(result.current.loading).toBe(true);
    expect(result.current.stats).toEqual({});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stats).toEqual({
      totalBugs: 10,
      openBugs: 3,
      inProgressBugs: 4,
      resolvedBugs: 3,
      criticalBugs: 1,
      highPriorityBugs: 2
    });
  });

  test('handles stats API errors', async () => {
    server.use(
      rest.get('http://localhost:5000/api/bugs/stats', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ success: false, message: 'Stats error' })
        );
      })
    );

    const { result } = renderHook(() => useBugStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Stats error');
    expect(result.current.stats).toEqual({});
  });
});