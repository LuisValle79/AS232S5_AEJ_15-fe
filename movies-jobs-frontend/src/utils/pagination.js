// Función debounce personalizada para optimizar búsquedas en tiempo real
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Función throttle para limitar la frecuencia de ejecución
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Función para formatear números con separadores de miles
export const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Función para calcular el número total de páginas
export const calculateTotalPages = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage);
};

// Función para obtener el rango de elementos mostrados en la página actual
export const getItemsRange = (currentPage, itemsPerPage, totalItems) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  return { start, end };
};

// Función para paginar un array
export const paginateArray = (array, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex);
};

// Función para generar números de página para la navegación
export const generatePageNumbers = (currentPage, totalPages, maxVisible = 5) => {
  const pages = [];
  const delta = Math.floor(maxVisible / 2);
  
  let start = Math.max(1, currentPage - delta);
  let end = Math.min(totalPages, currentPage + delta);
  
  // Ajustar el inicio si hay espacio al final
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  // Ajustar el final si hay espacio al inicio
  if (end - start < maxVisible - 1) {
    end = Math.min(totalPages, start + maxVisible - 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
};

// Función para validar los parámetros de paginación
export const validatePaginationParams = (page, itemsPerPage, totalItems) => {
  const validPage = Math.max(1, Math.min(page, Math.ceil(totalItems / itemsPerPage)));
  const validItemsPerPage = Math.max(1, itemsPerPage);
  
  return {
    page: validPage,
    itemsPerPage: validItemsPerPage,
    isValid: validPage === page && validItemsPerPage === itemsPerPage
  };
};