import React, { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { moviesService } from '../../services/moviesService.js';
import { useApiState, useForm } from '../../hooks/useApi.js';
import { validationRules } from '../../utils/validation.js';
import { MovieAlerts, AlertUtils } from '../../utils/sweetAlert.js';

const MovieForm = ({ movie, isEdit, onSuccess, onCancel }) => {
  const { loading, executeAsync } = useApiState();

  const initialState = {
    movieId: '',
    title: '',
    overview: '',
    posterPath: '',
    releaseDate: '',
    voteAverage: '',
    voteCount: '',
    popularity: '',
    genreIds: ''
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  } = useForm(initialState, validationRules.movie);

  useEffect(() => {
    if (isEdit && movie) {
      setValues({
        movieId: movie.movieId || '',
        title: movie.title || '',
        overview: movie.overview || '',
        posterPath: movie.posterPath || '',
        releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
        voteAverage: movie.voteAverage || '',
        voteCount: movie.voteCount || '',
        popularity: movie.popularity || '',
        genreIds: movie.genreIds || ''
      });
    }
  }, [movie, isEdit, setValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      await AlertUtils.warning('¡Formulario incompleto!', 'Por favor corrige los errores marcados en rojo antes de continuar.');
      return;
    }

    // Confirmación antes de guardar
    const confirmResult = await AlertUtils.confirmSave(
      isEdit ? '¿Actualizar película?' : '¿Crear nueva película?',
      isEdit ? `Se actualizará la información de "${values.title}"` : `Se creará la película "${values.title}"`
    );

    if (!confirmResult.isConfirmed) return;

    try {
      // Mostrar loading apropiado
      if (isEdit) {
        MovieAlerts.loadingUpdate();
      } else {
        MovieAlerts.loadingCreate();
      }

      await executeAsync(async () => {
        const movieData = {
          ...values,
          voteAverage: values.voteAverage ? parseFloat(values.voteAverage) : null,
          voteCount: values.voteCount ? parseInt(values.voteCount) : null,
          popularity: values.popularity ? parseFloat(values.popularity) : null
        };

        if (isEdit) {
          await moviesService.updateMovie(movie.id, movieData);
          AlertUtils.close();
          await MovieAlerts.successUpdate(values.title);
        } else {
          await moviesService.createMovie(movieData);
          AlertUtils.close();
          await MovieAlerts.successCreate(values.title);
        }

        onSuccess();
      });
    } catch (err) {
      AlertUtils.close();
      await MovieAlerts.errorSave();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEdit ? 'Editar Película' : 'Nueva Película'}</h2>
          <button onClick={onCancel} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="movie-form">
          <div className="form-grid">
            {/* Movie ID */}
            <div className="form-group">
              <label htmlFor="movieId">Movie ID *</label>
              <input
                type="text"
                id="movieId"
                name="movieId"
                value={values.movieId}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isEdit}
                className={errors.movieId && touched.movieId ? 'error' : ''}
              />
              {errors.movieId && touched.movieId && (
                <span className="error-text">{errors.movieId}</span>
              )}
            </div>

            {/* Título */}
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.title && touched.title ? 'error' : ''}
              />
              {errors.title && touched.title && (
                <span className="error-text">{errors.title}</span>
              )}
            </div>

            {/* Fecha de estreno */}
            <div className="form-group">
              <label htmlFor="releaseDate">Fecha de Estreno</label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={values.releaseDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.releaseDate && touched.releaseDate ? 'error' : ''}
              />
              {errors.releaseDate && touched.releaseDate && (
                <span className="error-text">{errors.releaseDate}</span>
              )}
            </div>

            {/* Calificación */}
            <div className="form-group">
              <label htmlFor="voteAverage">Calificación (0-10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                id="voteAverage"
                name="voteAverage"
                value={values.voteAverage}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.voteAverage && touched.voteAverage ? 'error' : ''}
              />
              {errors.voteAverage && touched.voteAverage && (
                <span className="error-text">{errors.voteAverage}</span>
              )}
            </div>

            {/* Número de votos */}
            <div className="form-group">
              <label htmlFor="voteCount">Número de Votos</label>
              <input
                type="number"
                min="0"
                id="voteCount"
                name="voteCount"
                value={values.voteCount}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.voteCount && touched.voteCount ? 'error' : ''}
              />
              {errors.voteCount && touched.voteCount && (
                <span className="error-text">{errors.voteCount}</span>
              )}
            </div>

            {/* Popularidad */}
            <div className="form-group">
              <label htmlFor="popularity">Popularidad</label>
              <input
                type="number"
                step="0.1"
                min="0"
                id="popularity"
                name="popularity"
                value={values.popularity}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.popularity && touched.popularity ? 'error' : ''}
              />
              {errors.popularity && touched.popularity && (
                <span className="error-text">{errors.popularity}</span>
              )}
            </div>
          </div>

          {/* URL del poster */}
          <div className="form-group">
            <label htmlFor="posterPath">URL del Poster</label>
            <input
              type="url"
              id="posterPath"
              name="posterPath"
              value={values.posterPath}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.posterPath && touched.posterPath ? 'error' : ''}
              placeholder="https://ejemplo.com/poster.jpg"
            />
            {errors.posterPath && touched.posterPath && (
              <span className="error-text">{errors.posterPath}</span>
            )}
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="overview">Descripción</label>
            <textarea
              id="overview"
              name="overview"
              rows="4"
              value={values.overview}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.overview && touched.overview ? 'error' : ''}
              placeholder="Descripción de la película..."
            />
            {errors.overview && touched.overview && (
              <span className="error-text">{errors.overview}</span>
            )}
          </div>

          {/* IDs de géneros */}
          <div className="form-group">
            <label htmlFor="genreIds">IDs de Géneros (separados por coma)</label>
            <input
              type="text"
              id="genreIds"
              name="genreIds"
              value={values.genreIds}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="1,2,3"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              <Save size={16} />
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;