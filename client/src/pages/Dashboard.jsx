import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import BugCard from '../components/BugCard';
import StatsCard from '../components/StatsCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBugs, setRecentBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, bugsResponse] = await Promise.all([
          api.get('/bugs/stats'),
          api.get('/bugs?limit=5&sort=-createdAt')
        ]);
        
        setStats(statsResponse.data);
        setRecentBugs(bugsResponse.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bug Tracker Dashboard</h1>
        <Link to="/bugs/new" className="btn btn-primary">
          Report New Bug
        </Link>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total Bugs"
          value={stats?.totalBugs || 0}
          color="blue"
        />
        <StatsCard
          title="Open"
          value={stats?.byStatus?.open || 0}
          color="red"
        />
        <StatsCard
          title="In Progress"
          value={stats?.byStatus?.['in-progress'] || 0}
          color="yellow"
        />
        <StatsCard
          title="Resolved"
          value={stats?.byStatus?.resolved || 0}
          color="green"
        />
      </div>

      <div className="recent-bugs">
        <div className="section-header">
          <h2>Recent Bugs</h2>
          <Link to="/bugs" className="view-all-link">
            View All
          </Link>
        </div>
        <div className="bugs-list">
          {recentBugs.map(bug => (
            <BugCard key={bug._id} bug={bug} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;