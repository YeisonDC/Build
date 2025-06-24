// src/api.js
import axios from 'axios';

// ✅ URL dinámica del backend desde variable de entorno
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const API = axios.create({
  baseURL: backendUrl, // Puerto del backend
});

// Este interceptor agrega el token JWT automáticamente si el usuario está logueado
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Extrae el token guardado en el navegador
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
