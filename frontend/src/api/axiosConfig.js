import axios from 'axios';

// Create the Axios instance
const API = axios.create({
  // 1. Use '/api' as the base.
  // This automatically uses "http://localhost:3000/api" locally
  // and "https://your-site.vercel.app/api" on the live site.
  // We removed '/v1' because your backend server.js does not use it.
  baseURL: process.env.REACT_APP_API_URL || '/api',
  
  withCredentials: true,
});

// REQUEST INTERCEPTOR: Attaches the token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Let Axios handle multipart/form-data boundaries automatically.
  // We delete the header here to prevent manual overrides breaking file uploads.
  if (config.data instanceof FormData && config.headers['Content-Type']) {
    delete config.headers['Content-Type'];
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// RESPONSE INTERCEPTOR (Optional but recommended): Handles global errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the token is expired (401), we can redirect to login (optional)
    if (error.response && error.response.status === 401) {
      console.error('Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

export default API;