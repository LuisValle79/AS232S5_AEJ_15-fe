import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, RotateCcw, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { moviesService } from '../../services/moviesService.js';
import { useApiState } from '../../hooks/useApi.js';
import { truncateText, formatDate } from '../../utils/validation.js';
import MovieForm from './MovieForm.jsx';
import MovieDetails from './MovieDetails.jsx';

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { loading, error, executeAsync } = useApiState();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      await executeAsync(async () => {
        const data = await moviesService.getAllMovies();
        console.log('Movies data received:', data);
        setMovies(Array.isArray(data) ? data : []);
      });
    } catch (err) {
      console.error('Error loading movies:', err);
      toast.error(`Error al cargar las películas: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadMovies();
      return;
    }

    try {
      await executeAsync(async () => {
        const data = await moviesService.searchMoviesByTitle(searchTerm);
        setMovies(data || []);
      });
    } catch (err) {
      toast.error('Error en la búsqueda');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta película?')) return;

    try {
      await executeAsync(async () => {
        await moviesService.deleteMovie(id);
        toast.success('Película eliminada correctamente');
        loadMovies();
      });
    } catch (err) {
      toast.error('Error al eliminar la película');
    }
  };

  const handleRestore = async (id) => {
    try {
      await executeAsync(async () => {
        await moviesService.restoreMovie(id);
        toast.success('Película restaurada correctamente');
        loadMovies();
      });
    } catch (err) {
      toast.error('Error al restaurar la película');
    }
  };

  const handleCreate = () => {
    setSelectedMovie(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setEditMode(true);
    setShowForm(true);
  };

  const handleView = (movie) => {
    setSelectedMovie(movie);
    setShowDetails(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadMovies();
  };

  return (
    <div className="movies-container">
      <div className="movies-header">
        <h1>Gestión de Películas</h1>
        <button 
          className="btn btn-primary"
          onClick={handleCreate}
        >
          <Plus size={16} />
          Nueva Película
        </button>
      </div>

      {/* Búsqueda */}
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Buscar películas por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button 
            onClick={handleSearch}
            className="btn btn-secondary"
            disabled={loading}
          >
            <Search size={16} />
            Buscar
          </button>
        </div>
      </div>

      {/* Lista de películas */}
      {loading && <div className="loading">Cargando...</div>}
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron películas</p>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <div className="table-container">
          <table className="movies-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Fecha Estreno</th>
                <th>Calificación</th>
                <th>Popularidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id || movie.movieId}>
                  <td>{movie.movieId}</td>
                  <td className="movie-title">{movie.title}</td>
                  <td>{truncateText(movie.overview, 80)}</td>
                  <td>{formatDate(movie.releaseDate)}</td>
                  <td>
                    <span className="rating">
                      ⭐ {movie.voteAverage || 'N/A'}
                    </span>
                  </td>
                  <td>{movie.popularity || 'N/A'}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleView(movie)}
                      className="btn btn-info btn-sm"
                      title="Ver detalles"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleEdit(movie)}
                      className="btn btn-warning btn-sm"
                      title="Editar"
                    >
                      <Edit size={14} />
                    </button>
                    {movie.isActive !== false ? (
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="btn btn-danger btn-sm"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(movie.id)}
                        className="btn btn-success btn-sm"
                        title="Restaurar"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <MovieForm
          movie={selectedMovie}
          isEdit={editMode}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Modal de detalles */}
      {showDetails && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default MoviesList;