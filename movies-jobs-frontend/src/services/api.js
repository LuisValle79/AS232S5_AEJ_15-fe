import axios from 'axios';

// Configuración base de Axios
// Usando URL relativa para aprovechar el proxy de Vite
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Aumentamos timeout a 30 segundos
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => {
    // Si la respuesta tiene la estructura ApiResponse, extraemos los datos
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      console.log('API Response:', response.data);
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export default api;