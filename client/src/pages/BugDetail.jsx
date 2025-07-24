// pages/BugDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers';
import { showNotification } from '../utils/notifications';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

const BugDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchBug = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bugs/${id}`);
        setBug(response.data);
      } catch (err) {
        setError('Failed to load bug details');
        console.error('Bug detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBug();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await api.patch(`/bugs/${id}/status`, { status: newStatus });
      setBug(response.data);
      showNotification('Bug status updated successfully', 'success');
    } catch (err) {
      showNotification('Failed to update bug status', 'error');
      console.error('Status update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/bugs/${id}`);
      showNotification('Bug deleted successfully', 'success');
      navigate('/bugs');
    } catch (err) {
      showNotification('Failed to delete bug', 'error');
      console.error('Delete error:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!bug) return <div className="error-message">Bug not found</div>;

  return (
    <div className="bug-detail-page">
      <div className="bug-header">
        <div className="bug-title-section">
          <h1>{bug.title}</h1>
          <div className="bug-meta">
            <span className={`status-badge status-${bug.status}`}>
              {bug.status}
            </span>
            <span className={`priority-badge priority-${bug.priority}`}>
              {bug.priority}
            </span>
          </div>
        </div>
        <div className="bug-actions">
          <Link to={`/bugs/${id}/edit`} className="btn btn-secondary">
            Edit Bug
          </Link>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="btn btn-danger"
          >
            Delete Bug
          </button>
        </div>
      </div>

      <div className="bug-content">
        <div className="bug-main">
          <div className="bug-description">
            <h3>Description</h3>
            <div className="description-content">
              {bug.description}
            </div>
          </div>

          <div className="status-actions">
            <h3>Update Status</h3>
            <div className="status-buttons">
              {['open', 'in-progress', 'resolved', 'closed'].map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || bug.status === status}
                  className={`btn ${bug.status === status ? 'btn-primary' : 'btn-outline'}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bug-sidebar">
          <div className="bug-info-card">
            <h3>Bug Information</h3>
            <div className="info-row">
              <label>Reporter:</label>
              <span>{bug.reporter}</span>
            </div>
            <div className="info-row">
              <label>Assignee:</label>
              <span>{bug.assignee || 'Unassigned'}</span>
            </div>
            <div className="info-row">
              <label>Created:</label>
              <span>{formatDate(bug.createdAt)}</span>
            </div>
            <div className="info-row">
              <label>Updated:</label>
              <span>{formatDate(bug.updatedAt)}</span>
            </div>
            <div className="info-row">
              <label>Priority:</label>
              <span className={`priority-text priority-${bug.priority}`}>
                {bug.priority}
              </span>
            </div>
            <div className="info-row">
              <label>Status:</label>
              <span className={`status-text status-${bug.status}`}>
                {bug.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Bug"
        message="Are you sure you want to delete this bug? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default BugDetail;
