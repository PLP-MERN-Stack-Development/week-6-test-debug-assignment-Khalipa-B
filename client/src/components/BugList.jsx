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

  // Render bug list
  return (
    <div className="space-y-4">
      {bugs.map((bug) => (
        <div key={bug._id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">{bug.title}</h4>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(bug.status)}`}>
                {bug.status}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(bug.priority)}`}>
                {bug.priority}
              </span>
            </div>
          </div>
          <p className="mt-2 text-gray-700">{bug.description}</p>
          <div className="mt-4 flex space-x-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => onEdit(bug)}
            >
              Edit
            </button>
            <button
              className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ${deletingId === bug._id ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleDelete(bug._id)}
              disabled={deletingId === bug._id}
            >
              {deletingId === bug._id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BugList;
