import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://vehicle-bookings-bajaniya-daksh.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Handle unauthorized (e.g., clear token, redirect to login)
        localStorage.removeItem('token');
        // You might want to dispatch an action or redirect here
      }
      
      toast.error(data.message || 'An error occurred');
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('Something went wrong.');
    }
    return Promise.reject(error);
  }
);

export default api;
