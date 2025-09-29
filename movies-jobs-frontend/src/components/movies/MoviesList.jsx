import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, RotateCcw, Eye, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import { moviesService } from '../../services/moviesService.js';
import { useApiState } from '../../hooks/useApi.js';
import { truncateText, formatDate } from '../../utils/validation.js';
import { MovieAlerts, AlertUtils } from '../../utils/sweetAlert.js';
import MovieForm from './MovieForm.jsx';
import MovieDetails from './MovieDetails.jsx';
import { debounce } from 'lodash'; // Import lodash debounce for real-time search

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showInactive, setShowInactive] = useState(false); // New state for toggling inactive movies
  const { loading, error, executeAsync } = useApiState();

  useEffect(() => {
    loadMovies();
  }, [showInactive]); // Reload movies when showInactive changes

  const loadMovies = async () => {
    try {
      MovieAlerts.loadingSearch();
      await executeAsync(async () => {
        const data = await moviesService.getAllMovies();
        // Filter movies based on showInactive state
        const filteredMovies = Array.isArray(data)
          ? data.filter((movie) => (showInactive ? movie.isActive === false : movie.isActive !== false))
          : [];
        setMovies(filteredMovies);
        AlertUtils.close();
      });
    } catch (err) {
      AlertUtils.close();
      console.error('Error loading movies:', err);
      await MovieAlerts.errorLoad();
    }
  };

  // External API search
  const handleExternalSearch = async () => {
    if (!searchTerm.trim()) {
      loadMovies();
      return;
    }

    try {
      MovieAlerts.loadingSearch();
      await executeAsync(async () => {
        const data = await moviesService.searchMoviesExternal(searchTerm);
        setMovies(Array.isArray(data) ? data : []);
        AlertUtils.close();
        if (!data || data.length === 0) {
          AlertUtils.info('Sin resultados', 'No se encontraron películas con ese título en la API externa.');
        }
      });
    } catch (err) {
      AlertUtils.close();
      await AlertUtils.error('Error en búsqueda externa', 'No se pudo realizar la búsqueda externa. Intenta de nuevo.');
    }
  };

  // Real-time database search with debouncing
  const handleDatabaseSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        loadMovies();
        return;
      }
      try {
        await executeAsync(async () => {
          const data = await moviesService.searchMoviesByTitle(term);
          setMovies(Array.isArray(data) ? data : []);
        });
      } catch (err) {
        await AlertUtils.error('Error en búsqueda', 'No se pudo realizar la búsqueda en la base de datos.');
      }
    }, 500), // Debounce for 500ms
    [executeAsync, showInactive]
  );

  const handleDelete = async (id, movieTitle) => {
    const result = await MovieAlerts.confirmDelete(movieTitle);
    
    if (result.isConfirmed) {
      try {
        MovieAlerts.loadingDelete();
        await executeAsync(async () => {
          await moviesService.deleteMovie(id);
          AlertUtils.close();
          await MovieAlerts.successDelete(movieTitle);
          loadMovies();
        });
      } catch (err) {
        AlertUtils.close();
        await AlertUtils.error('Error al eliminar', 'No se pudo eliminar la película. Intenta de nuevo.');
      }
    }
  };

  const handleRestore = async (id, movieTitle) => {
    const result = await MovieAlerts.confirmRestore(movieTitle);
    
    if (result.isConfirmed) {
      try {
        AlertUtils.loading('Restaurando película...', 'Procesando restauración');
        await executeAsync(async () => {
          await moviesService.restoreMovie(id);
          AlertUtils.close();
          await MovieAlerts.successRestore(movieTitle);
          loadMovies();
        });
      } catch (err) {
        AlertUtils.close();
        await AlertUtils.error('Error al restaurar', 'No se pudo restaurar la película. Intenta de nuevo.');
      }
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

  // Toggle between active and inactive movies
  const toggleInactiveMovies = () => {
    setShowInactive((prev) => !prev);
    setSearchTerm(''); // Clear search term when toggling
  };

  return (
    <div className="movies-container">
      <div className="movies-header">
        <h1>Gestión de Películas</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleCreate}>
            <Plus size={16} />
            Nueva Película
          </button>

        </div>
      </div>

      {/* Búsqueda */}
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            placeholder={
              showInactive
                ? 'Buscar películas inactivas por título...'
                : 'Buscar películas por título...'
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!showInactive) {
                handleDatabaseSearch(e.target.value); // Real-time search for active movies
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !showInactive) {
                handleExternalSearch(); // External search on Enter for active movies
              }
            }}
            className="search-input"
          />
          <button
            onClick={handleExternalSearch}
            className="btn btn-secondary"
            disabled={loading || showInactive}
            title={showInactive ? 'Búsqueda externa no disponible para películas inactivas' : ''}
          >
            <Search size={16} />
            Buscar Externa
          </button>
          <button
            onClick={() => handleDatabaseSearch(searchTerm)}
            className="btn btn-info"
            disabled={loading}
          >
            <Search size={16} />
            Buscar en Base de Datos
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
                <th>Estado</th>
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
                  <td>
                    <span
                      className={`status-badge ${
                        movie.isActive !== false ? 'active' : 'inactive'
                      }`}
                    >
                      {movie.isActive !== false ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
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
                      disabled={movie.isActive === false} // Disable edit for inactive movies
                    >
                      <Edit size={14} />
                    </button>
                    {movie.isActive !== false ? (
                      <button
                        onClick={() => handleDelete(movie.id, movie.title)}
                        className="btn btn-danger btn-sm"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(movie.id, movie.title)}
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