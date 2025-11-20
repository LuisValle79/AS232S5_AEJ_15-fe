import api from './api.js';

// Servicio para Movies API
export const moviesService = {
  // CREATE - Crear película
  createMovie: async (movieData) => {
    try {
      const response = await api.post('/movies', movieData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // READ - Obtener todas las películas activas
  getAllMovies: async () => {
    try {
      const response = await api.get('/movies');
      // Extraer datos de la respuesta envuelta ApiResponse
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // READ - Obtener película por ID
  getMovieById: async (id) => {
    try {
      const response = await api.get(`/movies/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // UPDATE - Actualizar película
  updateMovie: async (id, movieData) => {
    try {
      const response = await api.put(`/movies/${id}`, movieData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE - Eliminado lógico
  deleteMovie: async (id) => {
    try {
      const response = await api.delete(`/movies/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // RESTORE - Restaurar película
  restoreMovie: async (id) => {
    try {
      const response = await api.patch(`/movies/${id}/restore`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // SEARCH - Buscar por título
  searchMoviesByTitle: async (title) => {
    try {
      const response = await api.get(`/movies/search-by-title?title=${encodeURIComponent(title)}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // SEARCH - Búsqueda API externa
  searchMoviesExternal: async (title) => {
    try {
      const response = await api.get(`/movies/search?title=${encodeURIComponent(title)}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET ID - Obtener por título API externa
  getMovieIdByTitle: async (title) => {
    try {
      const response = await api.get(`/movies/getID?title=${encodeURIComponent(title)}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // READ - Obtener todas las películas eliminadas
  getAllDeletedMovies: async () => {
    try {
      const response = await api.get('/movies/deleted');
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // READ - Obtener película eliminada por ID
  getDeletedMovieById: async (id) => {
    try {
      const response = await api.get(`/movies/deleted/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }
};