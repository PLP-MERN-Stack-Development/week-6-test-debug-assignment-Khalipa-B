// pages/BugForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { validateBugForm } from '../utils/validation';
import { showNotification } from '../utils/notifications';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';

const BugForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assignee: '',
    reporter: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchBug = async () => {
        try {
          setInitialLoading(true);
          const response = await api.get(`/bugs/${id}`);
          setFormData(response.data);
        } catch (err) {
          showNotification('Failed to load bug details', 'error');
          navigate('/bugs');
        } finally {
          setInitialLoading(false);
        }
      };

      fetchBug();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateBugForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      
      if (isEdit) {
        await api.put(`/bugs/${id}`, formData);
        showNotification('Bug updated successfully', 'success');
      } else {
        await api.post('/bugs', formData);
        showNotification('Bug created successfully', 'success');
      }
      
      navigate('/bugs');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        `Failed to ${isEdit ? 'update' : 'create'} bug`;
      showNotification(errorMessage, 'error');
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <div className="bug-form-page">
      <div className="form-header">
        <h1>{isEdit ? 'Edit Bug' : 'Report New Bug'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bug-form">
        <FormField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          required
          rows={5}
        />

        <div className="form-row">
          <FormField
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleChange}
            error={errors.status}
            options={[
              { value: 'open', label: 'Open' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'closed', label: 'Closed' }
            ]}
          />

          <FormField
            label="Priority"
            name="priority"
            type="select"
            value={formData.priority}
            onChange={handleChange}
            error={errors.priority}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' }
            ]}
          />
        </div>

        <div className="form-row">
          <FormField
            label="Assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            error={errors.assignee}
          />

          <FormField
            label="Reporter"
            name="reporter"
            value={formData.reporter}
            onChange={handleChange}
            error={errors.reporter}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/bugs')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Bug' : 'Create Bug')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BugForm;
