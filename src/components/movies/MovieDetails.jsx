import React from 'react';
import { X, Calendar, Star, TrendingUp, Users } from 'lucide-react';
import { formatDate } from '../../utils/validation.js';

const MovieDetails = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-large">
        <div className="modal-header">
          <h2>Detalles de la Película</h2>
          <button onClick={onClose} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <div className="movie-details">
          <div className="movie-details-content">
            {/* Poster y información básica */}
            <div className="movie-main-info">
              {movie.posterPath && (
                <div className="movie-poster">
                  <img 
                    src={movie.posterPath} 
                    alt={movie.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="movie-id">ID: {movie.movieId}</p>
                
                {movie.overview && (
                  <div className="movie-overview">
                    <h4>Descripción</h4>
                    <p>{movie.overview}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="movie-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Fecha de Estreno</span>
                  <span className="stat-value">
                    {movie.releaseDate ? formatDate(movie.releaseDate) : 'No especificada'}
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Star size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Calificación</span>
                  <span className="stat-value">
                    {movie.voteAverage ? `⭐ ${movie.voteAverage}/10` : 'Sin calificación'}
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Votos</span>
                  <span className="stat-value">
                    {movie.voteCount ? movie.voteCount.toLocaleString() : '0'}
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Popularidad</span>
                  <span className="stat-value">
                    {movie.popularity ? movie.popularity.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="movie-additional-info">
              {movie.genreIds && (
                <div className="info-item">
                  <span className="info-label">Géneros:</span>
                  <span className="info-value">{movie.genreIds}</span>
                </div>
              )}

              {movie.createdAt && (
                <div className="info-item">
                  <span className="info-label">Creado:</span>
                  <span className="info-value">{formatDate(movie.createdAt)}</span>
                </div>
              )}

              {movie.updatedAt && (
                <div className="info-item">
                  <span className="info-label">Actualizado:</span>
                  <span className="info-value">{formatDate(movie.updatedAt)}</span>
                </div>
              )}

              <div className="info-item">
                <span className="info-label">Estado:</span>
                <span className={`status-badge ${movie.isActive !== false ? 'active' : 'inactive'}`}>
                  {movie.isActive !== false ? 'Activa' : 'Eliminada'}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button onClick={onClose} className="btn btn-primary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;