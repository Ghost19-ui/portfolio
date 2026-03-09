import axios from 'axios';

// Create the Axios instance
const API = axios.create({
  // 🚨 TACTICAL OVERRIDE: Hardwired directly to your live Node.js server 🚨
  baseURL: 'https://portfolio-cgpo.vercel.app/api',
  withCredentials: true,
});

// REQUEST INTERCEPTOR: Attaches the token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Let Axios handle multipart/form-data boundaries automatically.
  if (config.data instanceof FormData && config.headers['Content-Type']) {
    delete config.headers['Content-Type'];
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// RESPONSE INTERCEPTOR: Handles global errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

export default API;