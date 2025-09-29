import Swal from 'sweetalert2';

// Configuración base para SweetAlert2 con la nueva paleta de colores
const baseConfig = {
  customClass: {
    popup: 'custom-swal-popup',
    title: 'custom-swal-title',
    content: 'custom-swal-content',
    confirmButton: 'custom-swal-confirm',
    cancelButton: 'custom-swal-cancel',
    denyButton: 'custom-swal-deny'
  },
  buttonsStyling: false,
  reverseButtons: true,
  focusConfirm: false,
  allowOutsideClick: false,
  allowEscapeKey: true,
  showClass: {
    popup: 'animate__animated animate__fadeInUp animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutDown animate__faster'
  }
};

// Utilidades para diferentes tipos de alertas
export const AlertUtils = {
  // Alerta de confirmación para eliminar
  confirmDelete: async (title = '¿Estás seguro?', text = 'Esta acción no se puede deshacer') => {
    return await Swal.fire({
      ...baseConfig,
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
      cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    });
  },

  // Alerta de confirmación para restaurar
  confirmRestore: async (title = '¿Restaurar elemento?', text = 'El elemento volverá a estar activo') => {
    return await Swal.fire({
      ...baseConfig,
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-undo"></i> Sí, restaurar',
      cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280'
    });
  },

  // Alerta de éxito
  success: async (title = '¡Éxito!', text = '', timer = 3000) => {
    return await Swal.fire({
      ...baseConfig,
      title,
      text,
      icon: 'success',
      timer,
      timerProgressBar: true,
      confirmButtonText: '<i class="fas fa-check"></i> Entendido',
      confirmButtonColor: '#10b981',
      showConfirmButton: !timer
    });
  },

  // Alerta de error
  error: async (title = '¡Error!', text = '', showConfirmButton = true) => {
    return await Swal.fire({
      ...baseConfig,
      title,
      text,
      icon: 'error',
      confirmButtonText: '<i class="fas fa-check"></i> Entendido',
      confirmButtonColor: '#ef4444',
      showConfirmButton
    });
  },

  // Alerta de información
  info: async (title = 'Información', text = '', timer = null) => {
    return await Swal.fire({
      ...baseConfig,
      title,
      text,
      icon: 'info',
      timer,
      timerProgressBar: !!timer,
      confirmButtonText: '<i class="fas fa-info-circle"></i> Entendido',
      confirmButtonColor: '#22d3ee',
      showConfirmButton: !timer
    });
  },

  // Alerta de advertencia
  warning: async (title = '¡Advertencia!', text = '') => {
    return await Swal.fire({
      ...baseConfig,
      title,
      text,
      icon: 'warning',
      confirmButtonText: '<i class="fas fa-exclamation-triangle"></i> Entendido',
      confirmButtonColor: '#f59e0b'
    });
  },

  // Loading/Progreso
  loading: (title = 'Cargando...', text = 'Por favor espera un momento') => {
    Swal.fire({
      ...baseConfig,
      title,
      text,
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },

  // Cerrar loading
  close: () => {
    Swal.close();
  },

  // Toast notifications (pequeñas notificaciones)
  toast: {
    success: (message = '¡Operación exitosa!') => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'colored-toast'
        }
      });
    },

    error: (message = '¡Ha ocurrido un error!') => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        customClass: {
          popup: 'colored-toast'
        }
      });
    },

    info: (message = 'Información') => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'colored-toast'
        }
      });
    },

    warning: (message = '¡Advertencia!') => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: message,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        customClass: {
          popup: 'colored-toast'
        }
      });
    }
  },

  // Confirmación personalizada para formularios
  confirmSave: async (title = '¿Guardar cambios?', text = 'Se guardarán los cambios realizados') => {
    return await Swal.fire({
      ...baseConfig,
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-save"></i> Sí, guardar',
      cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
      confirmButtonColor: '#22d3ee',
      cancelButtonColor: '#6b7280'
    });
  },

  // Formulario de entrada simple
  inputText: async (title = 'Ingresa información', inputPlaceholder = '', inputValue = '') => {
    return await Swal.fire({
      ...baseConfig,
      title,
      input: 'text',
      inputPlaceholder,
      inputValue,
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-check"></i> Confirmar',
      cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
      confirmButtonColor: '#22d3ee',
      cancelButtonColor: '#6b7280',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }
      }
    });
  }
};

// Funciones específicas para Movies
export const MovieAlerts = {
  confirmDelete: (movieTitle) => 
    AlertUtils.confirmDelete(
      '¿Eliminar película?', 
      `¿Estás seguro de que quieres eliminar "${movieTitle}"? Esta acción se puede revertir desde la sección de películas eliminadas.`
    ),

  confirmRestore: (movieTitle) => 
    AlertUtils.confirmRestore(
      '¿Restaurar película?', 
      `¿Quieres restaurar "${movieTitle}"? La película volverá a estar activa.`
    ),

  successCreate: (movieTitle) => 
    AlertUtils.success(
      '¡Película creada!', 
      `"${movieTitle}" ha sido creada exitosamente.`
    ),

  successUpdate: (movieTitle) => 
    AlertUtils.success(
      '¡Película actualizada!', 
      `"${movieTitle}" ha sido actualizada exitosamente.`
    ),

  successDelete: (movieTitle) => 
    AlertUtils.success(
      '¡Película eliminada!', 
      `"${movieTitle}" ha sido eliminada exitosamente.`
    ),

  successRestore: (movieTitle) => 
    AlertUtils.success(
      '¡Película restaurada!', 
      `"${movieTitle}" ha sido restaurada exitosamente.`
    ),

  errorLoad: () => 
    AlertUtils.error(
      'Error al cargar películas', 
      'No se pudieron cargar las películas. Por favor, intenta de nuevo.'
    ),

  errorSave: () => 
    AlertUtils.error(
      'Error al guardar película', 
      'No se pudo guardar la película. Verifica los datos e intenta de nuevo.'
    ),

  loadingSearch: () => 
    AlertUtils.loading('Buscando películas...', 'Realizando búsqueda en la base de datos'),

  loadingCreate: () => 
    AlertUtils.loading('Creando película...', 'Guardando información de la película'),

  loadingUpdate: () => 
    AlertUtils.loading('Actualizando película...', 'Guardando cambios realizados'),

  loadingDelete: () => 
    AlertUtils.loading('Eliminando película...', 'Procesando eliminación')
};

// Funciones específicas para Jobs
export const JobAlerts = {
  confirmDelete: (jobTitle) => 
    AlertUtils.confirmDelete(
      '¿Eliminar trabajo?', 
      `¿Estás seguro de que quieres eliminar "${jobTitle}"? Esta acción se puede revertir desde la sección de trabajos eliminados.`
    ),

  confirmRestore: (jobTitle) => 
    AlertUtils.confirmRestore(
      '¿Restaurar trabajo?', 
      `¿Quieres restaurar "${jobTitle}"? El trabajo volverá a estar activo.`
    ),

  successCreate: (jobTitle) => 
    AlertUtils.success(
      '¡Trabajo creado!', 
      `"${jobTitle}" ha sido creado exitosamente.`
    ),

  successUpdate: (jobTitle) => 
    AlertUtils.success(
      '¡Trabajo actualizado!', 
      `"${jobTitle}" ha sido actualizado exitosamente.`
    ),

  successDelete: (jobTitle) => 
    AlertUtils.success(
      '¡Trabajo eliminado!', 
      `"${jobTitle}" ha sido eliminado exitosamente.`
    ),

  successRestore: (jobTitle) => 
    AlertUtils.success(
      '¡Trabajo restaurado!', 
      `"${jobTitle}" ha sido restaurado exitosamente.`
    ),

  errorLoad: () => 
    AlertUtils.error(
      'Error al cargar trabajos', 
      'No se pudieron cargar los trabajos. Por favor, intenta de nuevo.'
    ),

  errorSave: () => 
    AlertUtils.error(
      'Error al guardar trabajo', 
      'No se pudo guardar el trabajo. Verifica los datos e intenta de nuevo.'
    ),

  loadingSearch: () => 
    AlertUtils.loading('Buscando trabajos...', 'Realizando búsqueda en la base de datos'),

  loadingCreate: () => 
    AlertUtils.loading('Creando trabajo...', 'Guardando información del trabajo'),

  loadingUpdate: () => 
    AlertUtils.loading('Actualizando trabajo...', 'Guardando cambios realizados'),

  loadingDelete: () => 
    AlertUtils.loading('Eliminando trabajo...', 'Procesando eliminación')
};

export default AlertUtils;