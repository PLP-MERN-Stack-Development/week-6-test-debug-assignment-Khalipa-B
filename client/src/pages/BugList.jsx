import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { useDebounce } from '../utils/hooks';
import BugCard from '../components/BugCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const BugList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    assignee: searchParams.get('assignee') || ''
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        
        if (debouncedSearch) queryParams.append('search', debouncedSearch);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.priority) queryParams.append('priority', filters.priority);
        if (filters.assignee) queryParams.append('assignee', filters.assignee);
        
        const page = searchParams.get('page') || 1;
        queryParams.append('page', page);
        queryParams.append('limit', '10');

        const response = await api.get(`/bugs?${queryParams.toString()}`);
        setBugs(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError('Failed to load bugs');
        console.error('Bug list error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, [debouncedSearch, filters.status, filters.priority, filters.assignee, searchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete('page');
    setSearchParams(params);
  };

  const handleBugUpdate = (updatedBug) => {
    setBugs(prev => prev.map(bug => 
      bug._id === updatedBug._id ? updatedBug : bug
    ));
  };

  const handleBugDelete = (deletedBugId) => {
    setBugs(prev => prev.filter(bug => bug._id !== deletedBugId));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bug-list-page">
      <div className="page-header">
        <h1>Bug Reports</h1>
        <Link to="/bugs/new" className="btn btn-primary">
          Report New Bug
        </Link>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {error && <div className="error-message">{error}</div>}

      <div className="bugs-grid">
        {bugs.length === 0 ? (
          <div className="no-bugs">
            <p>No bugs found matching your criteria.</p>
          </div>
        ) : (
          bugs.map(bug => (
            <BugCard
              key={bug._id}
              bug={bug}
              onUpdate={handleBugUpdate}
              onDelete={handleBugDelete}
            />
          ))
        )}
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams);
            params.set('page', page);
            setSearchParams(params);
          }}
        />
      )}
    </div>
  );
};

export default BugList;