import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Transform error for consistent handling
    const transformedError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      errors: error.response?.data?.errors || [],
    };

    return Promise.reject(transformedError);
  }
);

// Bug API functions
export const bugAPI = {
  // Get all bugs with optional filters
  getAll: (params = {}) => {
    return api.get('/bugs', { params });
  },

  // Get single bug by ID
  getById: (id) => {
    return api.get(`/bugs/${id}`);
  },

  // Create new bug
  create: (bugData) => {
    return api.post('/bugs', bugData);
  },

  // Update bug
  update: (id, bugData) => {
    return api.put(`/bugs/${id}`, bugData);
  },

  // Delete bug
  delete: (id) => {
    return api.delete(`/bugs/${id}`);
  },

  // Get bug statistics
  getStats: () => {
    return api.get('/bugs/stats');
  },
};

export default api;