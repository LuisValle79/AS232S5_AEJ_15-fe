import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Eye, AlertTriangle, Building, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { jobsService } from '../../services/jobsService.js';
import { useApiState } from '../../hooks/useApi.js';
import { truncateText, formatDate } from '../../utils/validation.js';
import { JobAlerts, AlertUtils } from '../../utils/sweetAlert.js';
import JobDetails from './JobDetails.jsx';
import Pagination from '../common/Pagination.jsx';

const DeletedJobsList = () => {
  const [deletedJobs, setDeletedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]); // Para paginación
  const [showDetails, setShowDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  const { loading, error, executeAsync } = useApiState();

  useEffect(() => {
    loadDeletedJobs();
  }, []);

  useEffect(() => {
    // Filtrar trabajos localmente cuando cambie el término de búsqueda
    if (searchTerm.trim()) {
      const filtered = deletedJobs.filter(job =>
        job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(deletedJobs);
    }
    setCurrentPage(1); // Resetear a la primera página cuando se filtra
  }, [searchTerm, deletedJobs]);

  // Efecto para actualizar la paginación cuando cambian los datos filtrados
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
    setDisplayedJobs(paginatedJobs);
    setTotalItems(filteredJobs.length);
  }, [filteredJobs, currentPage, itemsPerPage]);

  const loadDeletedJobs = async () => {
    try {
      AlertUtils.loading('Cargando trabajos eliminados...', 'Obteniendo lista de trabajos en papelera');
      await executeAsync(async () => {
        const data = await jobsService.getAllDeletedJobs();
        const jobsArray = Array.isArray(data) ? data : [];
        setDeletedJobs(jobsArray);
        setFilteredJobs(jobsArray);
        AlertUtils.close();
        
        if (jobsArray.length === 0) {
          AlertUtils.info('¡Sin trabajos eliminados!', 'No hay trabajos en la papelera. ¡Excelente!');
        }
      });
    } catch (err) {
      AlertUtils.close();
      console.error('Error loading deleted jobs:', err);
      await AlertUtils.error('Error al cargar', 'No se pudieron cargar los trabajos eliminados. Intenta de nuevo.');
    }
  };

  const handleRestore = async (id, jobTitle) => {
    const result = await JobAlerts.confirmRestore(jobTitle);
    
    if (result.isConfirmed) {
      try {
        AlertUtils.loading('Restaurando trabajo...', 'Procesando restauración desde papelera');
        await executeAsync(async () => {
          await jobsService.restoreJob(id);
          AlertUtils.close();
          await JobAlerts.successRestore(jobTitle);
          loadDeletedJobs();
        });
      } catch (err) {
        AlertUtils.close();
        console.error('Error restoring job:', err);
        await AlertUtils.error('Error al restaurar', 'No se pudo restaurar el trabajo. Intenta de nuevo.');
      }
    }
  };

  const handleView = (job) => {
    setSelectedJob(job);
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
    <div className="deleted-jobs-container">
      <div className="deleted-jobs-header">
        <h1>
          <AlertTriangle size={24} className="header-icon" />
          Trabajos Eliminados
        </h1>
        <p className="subtitle">
          Aquí puedes ver todos los trabajos que han sido eliminados y restaurarlos si es necesario.
        </p>
      </div>

      {/* Búsqueda local */}
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Buscar trabajos eliminados por título o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Search size={16} className="search-icon" />
        </div>
      </div>

      {/* Lista de trabajos eliminados */}
      {loading && <div className="loading">Cargando trabajos eliminados...</div>}

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {!loading && totalItems === 0 && deletedJobs.length === 0 && (
        <div className="empty-state">
          <AlertTriangle size={48} />
          <h3>No hay trabajos eliminados</h3>
          <p>¡Excelente! No tienes trabajos en la papelera.</p>
        </div>
      )}

      {!loading && totalItems === 0 && deletedJobs.length > 0 && (
        <div className="empty-state">
          <Search size={48} />
          <h3>No se encontraron resultados</h3>
          <p>No hay trabajos eliminados que coincidan con tu búsqueda.</p>
        </div>
      )}

      {!loading && displayedJobs.length > 0 && (
        <>
          <div className="table-container">
            <div className="table-header">
              <h3>
                Se encontraron {totalItems} trabajo{totalItems !== 1 ? 's' : ''} eliminado{totalItems !== 1 ? 's' : ''}
              </h3>
            </div>
            
            <table className="deleted-jobs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Empresa</th>
                  <th>Título</th>
                  <th>Ubicación</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedJobs.map((job) => (
                  <tr key={job.id || job.jobId} className="deleted-row">
                    <td>{job.jobId}</td>
                    <td className="employer-name">
                      <Building size={14} className="icon" />
                      {job.employerName}
                    </td>
                    <td className="job-title">{truncateText(job.jobTitle, 40)}</td>
                    <td className="location">
                      <MapPin size={14} className="icon" />
                      {job.jobCity}, {job.jobCountry}
                    </td>
                    <td>
                      <span className={`employment-type ${job.jobEmploymentType?.toLowerCase().replace('-', '')}`}>
                        {job.jobEmploymentType}
                      </span>
                    </td>
                    <td>{formatDate(job.jobPostedAt)}</td>
                    <td>
                      <span className="status-badge deleted">
                        Eliminado
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleView(job)}
                        className="btn btn-info btn-sm"
                        title="Ver detalles"
                      >
                        <Eye size={14} />
                        Ver
                      </button>
                      <button
                        onClick={() => handleRestore(job.id, job.jobTitle)}
                        className="btn btn-success btn-sm"
                        title="Restaurar trabajo"
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
        <JobDetails
          job={selectedJob}
          onClose={() => setShowDetails(false)}
          isDeleted={true}
        />
      )}
    </div>
  );
};

export default DeletedJobsList;