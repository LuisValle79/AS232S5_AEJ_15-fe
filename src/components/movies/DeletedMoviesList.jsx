import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { moviesService } from '../../services/moviesService.js';
import { useApiState } from '../../hooks/useApi.js';
import { truncateText, formatDate } from '../../utils/validation.js';
import { MovieAlerts, AlertUtils } from '../../utils/sweetAlert.js';
import MovieDetails from './MovieDetails.jsx';
import Pagination from '../common/Pagination.jsx';

const DeletedMoviesList = () => {
  const [deletedMovies, setDeletedMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]); // Para paginación
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  const { loading, error, executeAsync } = useApiState();

  useEffect(() => {
    loadDeletedMovies();
  }, []);

  useEffect(() => {
    // Filtrar películas localmente cuando cambie el término de búsqueda
    if (searchTerm.trim()) {
      const filtered = deletedMovies.filter(movie =>
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(deletedMovies);
    }
    setCurrentPage(1); // Resetear a la primera página cuando se filtra
  }, [searchTerm, deletedMovies]);

  // Efecto para actualizar la paginación cuando cambian los datos filtrados
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
    setDisplayedMovies(paginatedMovies);
    setTotalItems(filteredMovies.length);
  }, [filteredMovies, currentPage, itemsPerPage]);

  const loadDeletedMovies = async () => {
    try {
      AlertUtils.loading('Cargando películas eliminadas...', 'Obteniendo lista de películas en papelera');
      await executeAsync(async () => {
        const data = await moviesService.getAllDeletedMovies();
        const moviesArray = Array.isArray(data) ? data : [];
        setDeletedMovies(moviesArray);
        setFilteredMovies(moviesArray);
        AlertUtils.close();
        
        if (moviesArray.length === 0) {
          AlertUtils.info('¡Sin películas eliminadas!', 'No hay películas en la papelera. ¡Excelente!');
        }
      });
    } catch (err) {
      AlertUtils.close();
      console.error('Error loading deleted movies:', err);
      await AlertUtils.error('Error al cargar', 'No se pudieron cargar las películas eliminadas. Intenta de nuevo.');
    }
  };

  const handleRestore = async (id, movieTitle) => {
    const result = await MovieAlerts.confirmRestore(movieTitle);
    
    if (result.isConfirmed) {
      try {
        AlertUtils.loading('Restaurando película...', 'Procesando restauración desde papelera');
        await executeAsync(async () => {
          await moviesService.restoreMovie(id);
          AlertUtils.close();
          await MovieAlerts.successRestore(movieTitle);
          loadDeletedMovies();
        });
      } catch (err) {
        AlertUtils.close();
        console.error('Error restoring movie:', err);
        await AlertUtils.error('Error al restaurar', 'No se pudo restaurar la película. Intenta de nuevo.');
      }
    }
  };

  const handleView = (movie) => {
    setSelectedMovie(movie);
    setShowDetails(true);
  };

  // Funciones para manejar la paginación
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="deleted-movies-container">
      <div className="deleted-movies-header">
        <h1>
          <AlertTriangle size={24} className="header-icon" />
          Películas Eliminadas
        </h1>
        <p className="subtitle">
          Aquí puedes ver todas las películas que han sido eliminadas y restaurarlas si es necesario.
        </p>
      </div>

      {/* Búsqueda local */}
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Buscar películas eliminadas por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Search size={16} className="search-icon" />
        </div>
      </div>

      {/* Lista de películas eliminadas */}
      {loading && <div className="loading">Cargando películas eliminadas...</div>}

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {!loading && totalItems === 0 && deletedMovies.length === 0 && (
        <div className="empty-state">
          <AlertTriangle size={48} />
          <h3>No hay películas eliminadas</h3>
          <p>¡Excelente! No tienes películas en la papelera.</p>
        </div>
      )}

      {!loading && totalItems === 0 && deletedMovies.length > 0 && (
        <div className="empty-state">
          <Search size={48} />
          <h3>No se encontraron resultados</h3>
          <p>No hay películas eliminadas que coincidan con tu búsqueda.</p>
        </div>
      )}

      {!loading && displayedMovies.length > 0 && (
        <>
          <div className="table-container">
            <div className="table-header">
              <h3>
                Se encontraron {totalItems} película{totalItems !== 1 ? 's' : ''} eliminada{totalItems !== 1 ? 's' : ''}
              </h3>
            </div>
            
            <table className="deleted-movies-table">
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
                {displayedMovies.map((movie) => (
                  <tr key={movie.id || movie.movieId} className="deleted-row">
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
                      <span className="status-badge deleted">
                        Eliminada
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleView(movie)}
                        className="btn btn-info btn-sm"
                        title="Ver detalles"
                      >
                        <Eye size={14} />
                        Ver
                      </button>
                      <button
                        onClick={() => handleRestore(movie.id, movie.title)}
                        className="btn btn-success btn-sm"
                        title="Restaurar película"
                      >
                        <RotateCcw size={14} />
                        Restaurar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Componente de paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            className={loading ? 'pagination-loading' : ''}
          />
        </>
      )}

      {/* Modal de detalles */}
      {showDetails && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setShowDetails(false)}
          isDeleted={true}
        />
      )}
    </div>
  );
};

export default DeletedMoviesList;