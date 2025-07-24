import React from 'react';
import { useBugStats } from '../hooks/useBugs';

const Dashboard = () => {
  const { stats, loading, error } = useBugStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">Failed to load statistics</div>
        <div className="text-gray-500 text-sm">{error}</div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Bugs',
      value: stats.totalBugs || 0,
      color: 'bg-blue-500',
      icon: '📊'
    },
    {
      name: 'Open Bugs',
      value: stats.openBugs || 0,
      color: 'bg-red-500',
      icon: '🔴'
    },
    {
      name: 'In Progress',
      value: stats.inProgressBugs || 0,
      color: 'bg-yellow-500',
      icon: '🟡'
    },
    {
      name: 'Resolved',
      value: stats.resolvedBugs || 0,
      color: 'bg-green-500',
      icon: '✅'
    },
    {
      name: 'Critical Priority',
      value: stats.criticalBugs || 0,
      color: 'bg-red-600',
      icon: '🚨'
    },
    {
      name: 'High Priority',
      value: stats.highPriorityBugs || 0,
      color: 'bg-orange-500',
      icon: '⚠️'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Overview of your bug tracking system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 ${stat.color} rounded-md flex items-center justify-center`}>
                    <span className="text-white text-sm">{stat.icon}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;