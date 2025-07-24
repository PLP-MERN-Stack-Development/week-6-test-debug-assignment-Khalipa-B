import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const BugForm = ({ bug, onSubmit, onCancel, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      assignee: '',
      reporter: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bug) {
      setValue('title', bug.title);
      setValue('description', bug.description);
      setValue('status', bug.status);
      setValue('priority', bug.priority);
      setValue('assignee', bug.assignee || '');
      setValue('reporter', bug.reporter);
    }
  }, [bug, setValue]);

  const onFormSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      if (!bug) {
        reset(); // Only reset form for new bugs
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters long'
            },
            maxLength: {
              value: 100,
              message: 'Title cannot exceed 100 characters'
            }
          })}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Enter bug title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', {
            required: 'Description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters long'
            },
            maxLength: {
              value: 1000,
              message: 'Description cannot exceed 1000 characters'
            }
          })}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Describe the bug in detail"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            {...register('priority')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
            Assignee
          </label>
          <input
            type="text"
            id="assignee"
            {...register('assignee', {
              maxLength: {
                value: 50,
                message: 'Assignee name cannot exceed 50 characters'
              }
            })}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.assignee ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Assign to someone"
          />
          {errors.assignee && (
            <p className="mt-1 text-sm text-red-600">{errors.assignee.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="reporter" className="block text-sm font-medium text-gray-700">
            Reporter *
          </label>
          <input
            type="text"
            id="reporter"
            {...register('reporter', {
              required: 'Reporter name is required',
              minLength: {
                value: 2,
                message: 'Reporter name must be at least 2 characters long'
              },
              maxLength: {
                value: 50,
                message: 'Reporter name cannot exceed 50 characters'
              }
            })}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.reporter ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Your name"
          />
          {errors.reporter && (
            <p className="mt-1 text-sm text-red-600">{errors.reporter.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting || loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? 'Saving...' : bug ? 'Update Bug' : 'Create Bug'}
        </button>
      </div>
    </form>
  );
};

export default BugForm;