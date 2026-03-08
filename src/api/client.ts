import axios from 'axios';

export const backendApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000',
  headers: { 'Content-Type': 'application/json' },
});

backendApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const orchesApi = axios.create({
  baseURL: import.meta.env.VITE_ORCHES_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});
