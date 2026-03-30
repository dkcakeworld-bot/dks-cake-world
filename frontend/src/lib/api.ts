import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send httpOnly cookies
  timeout: 15000,
});

// Attach JWT token from cookie as a fallback header
api.interceptors.request.use((config) => {
  const token = Cookies.get('adminToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle 401 globally
    return Promise.reject(error);
  }
);

export default api;
