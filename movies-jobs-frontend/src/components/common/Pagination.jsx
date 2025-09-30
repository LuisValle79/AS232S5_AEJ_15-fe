import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 15, 20, 25, 50],
  showSizeChanger = true,
  showInfo = true,
  className = ""
}) => {
  // Calcular el rango de elementos mostrados
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    // Remover duplicados y manejar casos especiales
    const uniquePages = [];
    rangeWithDots.forEach((page, index) => {
      if (index === 0 || rangeWithDots[index - 1] !== page) {
        uniquePages.push(page);
      }
    });

    return totalPages > 1 ? uniquePages : [];
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className={`pagination-container ${className}`}>
      {/* Información de elementos mostrados */}
      {showInfo && (
        <div className="pagination-info">
          <span>
            Mostrando {startItem} a {endItem} de {totalItems} resultados
          </span>
        </div>
      )}

      {/* Controles de paginación */}
      <div className="pagination-controls">
        {/* Selector de elementos por página */}
        {showSizeChanger && (
          <div className="page-size-selector">
            <label>
              Mostrar:
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="page-size-select"
              >
                {itemsPerPageOptions.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              por página
            </label>
          </div>
        )}

        {/* Navegación de páginas */}
        <div className="pagination-nav">
          {/* Ir a primera página */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="pagination-btn pagination-btn-first"
            title="Primera página"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Página anterior */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn pagination-btn-prev"
            title="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Números de página */}
          <div className="pagination-numbers">
            {pageNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="pagination-dots">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`pagination-btn pagination-number ${
                      currentPage === page ? 'active' : ''
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Página siguiente */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn pagination-btn-next"
            title="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>

          {/* Ir a última página */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-btn pagination-btn-last"
            title="Última página"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;