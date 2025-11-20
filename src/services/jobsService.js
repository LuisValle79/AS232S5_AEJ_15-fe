import api from './api.js';

// Servicio para Jobs API
export const jobsService = {
  // CREATE - Crear trabajo
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // READ - Obtener todos los trabajos activos
  getAllJobs: async () => {
    try {
      const response = await api.get('/jobs');
      // Extraer datos de la respuesta envuelta ApiResponse
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // READ - Obtener trabajo por ID
  getJobById: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // UPDATE - Actualizar trabajo
  updateJob: async (id, jobData) => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE - Eliminado lógico
  deleteJob: async (id) => {
    try {
      const response = await api.delete(`/jobs/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // RESTORE - Restaurar trabajo
  restoreJob: async (id) => {
    try {
      const response = await api.patch(`/jobs/${id}/restore`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // SEARCH - Buscar por título
  searchJobsByTitle: async (title) => {
    try {
      const response = await api.get(`/jobs/search-by-title?title=${encodeURIComponent(title)}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // SEARCH - Buscar por empresa
  searchJobsByEmployer: async (employer) => {
    try {
      const response = await api.get(`/jobs/search-by-employer?employer=${encodeURIComponent(employer)}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // SEARCH - Buscar por país
  searchJobsByCountry: async (country) => {
    try {
      const response = await api.get(`/jobs/search-by-country?country=${encodeURIComponent(country)}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // SEARCH - Buscar por ciudad
  searchJobsByCity: async (city) => {
    try {
      const response = await api.get(`/jobs/search-by-city?city=${encodeURIComponent(city)}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // SEARCH - Búsqueda API externa
  searchJobsExternal: async (query, country = '') => {
    try {
      const params = new URLSearchParams({ query });
      if (country) params.append('country', country);
      const response = await api.get(`/jobs/search?${params.toString()}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // SEARCH - Búsqueda API externa avanzada con parámetros
  searchJobsExternalApi: async (searchParams) => {
    try {
      const { query, country, pages } = searchParams;
      const params = new URLSearchParams();
      
      // El parámetro 'query' es requerido
      if (query) params.append('query', query);
      if (country) params.append('country', country);
      if (pages) params.append('pages', pages);
      
      // Log para depuración
      const url = `/jobs/search?${params.toString()}`;
      console.log('URL de búsqueda:', url);
      console.log('Parámetros enviados:', { query, country, pages });
      
      const response = await api.get(url);
      console.log('Respuesta exitosa:', response);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error detallado en searchJobsExternalApi:', error);
      console.error('Configuración de la solicitud:', error.config);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response);
      }
      throw error;
    }
  },

  // READ - Obtener todos los trabajos eliminados
  getAllDeletedJobs: async () => {
    try {
      const response = await api.get('/jobs/deleted');
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // READ - Obtener trabajo eliminado por ID
  getDeletedJobById: async (id) => {
    try {
      const response = await api.get(`/jobs/deleted/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }
};