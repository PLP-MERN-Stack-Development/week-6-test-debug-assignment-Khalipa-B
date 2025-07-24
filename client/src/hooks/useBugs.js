import { useState, useEffect } from 'react';
import { bugAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useBugs = (filters = {}) => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchBugs = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bugAPI.getAll({ ...filters, ...params });
      setBugs(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching bugs:', err);
      setError(err.message);
      toast.error('Failed to fetch bugs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, [JSON.stringify(filters)]);

  const createBug = async (bugData) => {
    try {
      const response = await bugAPI.create(bugData);
      setBugs(prev => [response.data.data, ...prev]);
      toast.success('Bug created successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error creating bug:', err);
      toast.error(err.message);
      throw err;
    }
  };

  const updateBug = async (id, bugData) => {
    try {
      const response = await bugAPI.update(id, bugData);
      setBugs(prev => prev.map(bug => 
        bug._id === id ? response.data.data : bug
      ));
      toast.success('Bug updated successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error updating bug:', err);
      toast.error(err.message);
      throw err;
    }
  };

  const deleteBug = async (id) => {
    try {
      await bugAPI.delete(id);
      setBugs(prev => prev.filter(bug => bug._id !== id));
      toast.success('Bug deleted successfully');
    } catch (err) {
      console.error('Error deleting bug:', err);
      toast.error(err.message);
      throw err;
    }
  };

  const refetch = () => {
    fetchBugs();
  };

  return {
    bugs,
    loading,
    error,
    pagination,
    createBug,
    updateBug,
    deleteBug,
    refetch,
    fetchBugs
  };
};

export const useBugStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await bugAPI.getStats();
        setStats(response.data.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};