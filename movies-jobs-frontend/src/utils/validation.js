// Utilidades de validación
export const validationRules = {
  // Validaciones para Movies
  movie: {
    movieId: (value) => {
      if (!value || value.trim() === '') return 'Movie ID es requerido';
      if (value.length < 3) return 'Movie ID debe tener al menos 3 caracteres';
      return '';
    },
    title: (value) => {
      if (!value || value.trim() === '') return 'Título es requerido';
      if (value.length < 2) return 'Título debe tener al menos 2 caracteres';
      if (value.length > 200) return 'Título no puede exceder 200 caracteres';
      return '';
    },
    overview: (value) => {
      if (value && value.length > 1000) return 'Descripción no puede exceder 1000 caracteres';
      return '';
    },
    posterPath: (value) => {
      if (value && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value)) {
        return 'URL del poster debe ser una URL válida de imagen';
      }
      return '';
    },
    releaseDate: (value) => {
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return 'Fecha debe estar en formato YYYY-MM-DD';
      }
      return '';
    },
    voteAverage: (value) => {
      if (value !== '' && value !== null && value !== undefined) {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0 || num > 10) {
          return 'Calificación debe estar entre 0 y 10';
        }
      }
      return '';
    },
    voteCount: (value) => {
      if (value !== '' && value !== null && value !== undefined) {
        const num = parseInt(value);
        if (isNaN(num) || num < 0) {
          return 'Número de votos debe ser un número positivo';
        }
      }
      return '';
    },
    popularity: (value) => {
      if (value !== '' && value !== null && value !== undefined) {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
          return 'Popularidad debe ser un número positivo';
        }
      }
      return '';
    }
  },

  // Validaciones para Jobs
  job: {
    jobId: (value) => {
      if (!value || value.trim() === '') return 'Job ID es requerido';
      if (value.length < 3) return 'Job ID debe tener al menos 3 caracteres';
      return '';
    },
    employerName: (value) => {
      if (!value || value.trim() === '') return 'Nombre de la empresa es requerido';
      if (value.length < 2) return 'Nombre debe tener al menos 2 caracteres';
      if (value.length > 200) return 'Nombre no puede exceder 200 caracteres';
      return '';
    },
    jobTitle: (value) => {
      if (!value || value.trim() === '') return 'Título del trabajo es requerido';
      if (value.length < 2) return 'Título debe tener al menos 2 caracteres';
      if (value.length > 200) return 'Título no puede exceder 200 caracteres';
      return '';
    },
    jobDescription: (value) => {
      if (value && value.length > 2000) return 'Descripción no puede exceder 2000 caracteres';
      return '';
    },
    jobCountry: (value) => {
      if (!value || value.trim() === '') return 'País es requerido';
      return '';
    },
    jobCity: (value) => {
      if (!value || value.trim() === '') return 'Ciudad es requerida';
      return '';
    },
    jobPostedAt: (value) => {
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return 'Fecha debe estar en formato YYYY-MM-DD';
      }
      return '';
    },
    jobApplyLink: (value) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        return 'Link de aplicación debe ser una URL válida';
      }
      return '';
    },
    jobEmploymentType: (value) => {
      const validTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Freelance'];
      if (value && !validTypes.includes(value)) {
        return 'Tipo de empleo debe ser uno de: ' + validTypes.join(', ');
      }
      return '';
    }
  }
};

// Función para formatear fechas
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Función para formatear números
export const formatNumber = (value, decimals = 1) => {
  if (value === null || value === undefined || value === '') return '';
  const num = parseFloat(value);
  return isNaN(num) ? '' : num.toFixed(decimals);
};

// Función para truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};