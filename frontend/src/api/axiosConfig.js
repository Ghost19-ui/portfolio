import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://portfolio-cgpo.vercel.app/api/v1',
  withCredentials: true,
});

// REQUEST INTERCEPTOR: Attaches the token; never override Content-Type for FormData
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let Axios set multipart/form-data with boundary when body is FormData
  if (config.data instanceof FormData && config.headers['Content-Type']) {
    delete config.headers['Content-Type'];
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;