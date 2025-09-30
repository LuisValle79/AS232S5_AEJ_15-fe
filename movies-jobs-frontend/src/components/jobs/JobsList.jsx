import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, RotateCcw, Eye, MapPin, Building } from 'lucide-react';
import { toast } from 'react-toastify';
import { jobsService } from '../../services/jobsService.js';
import { useApiState } from '../../hooks/useApi.js';
import { truncateText, formatDate } from '../../utils/validation.js';
import { JobAlerts, AlertUtils } from '../../utils/sweetAlert.js';
import JobForm from './JobForm.jsx';
import JobDetails from './JobDetails.jsx';
import Pagination from '../common/Pagination.jsx';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]); // Para almacenar todos los trabajos
  const [filteredJobs, setFilteredJobs] = useState([]); // Para búsqueda local en tiempo real
  const [searchTerm, setSearchTerm] = useState('');
  const [externalSearchParams, setExternalSearchParams] = useState({
    country: '',
    numPages: 1
  });
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  const { loading, error, executeAsync } = useApiState();

  useEffect(() => {
    loadJobs();
  }, []);

  // Efecto para actualizar la paginación cuando cambian los datos
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
    setJobs(paginatedJobs);
    setTotalItems(filteredJobs.length);
  }, [filteredJobs, currentPage, itemsPerPage]);

  // Efecto para búsqueda local en tiempo real
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = allJobs.filter(job => 
        job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobCountry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobEmploymentType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(allJobs);
    }
    setCurrentPage(1); // Resetear a la primera página en búsquedas
  }, [searchTerm, allJobs]);

  const loadJobs = async () => {
    try {
      JobAlerts.loadingSearch();
      await executeAsync(async () => {
        const data = await jobsService.getAllJobs();
        console.log('Jobs data received:', data);
        const jobsArray = Array.isArray(data) ? data : [];
        setAllJobs(jobsArray);
        setFilteredJobs(jobsArray);
        setCurrentPage(1); // Resetear a la primera página
        setSearchTerm(''); // Limpiar búsqueda
        setExternalSearchParams({ country: '', numPages: 1 }); // Limpiar parámetros externos
        AlertUtils.close();
      });
    } catch (err) {
      AlertUtils.close();
      console.error('Error loading jobs:', err);
      await JobAlerts.errorLoad();
    }
  };

  // Búsqueda externa por API con parámetros opcionales
  const handleExternalApiSearch = async () => {
    if (!searchTerm.trim()) {
      await AlertUtils.warning('Título requerido', 'Debes ingresar un título para buscar en la API externa.');
      return;
    }

    try {
      JobAlerts.loadingSearch();
      await executeAsync(async () => {
        // Construir parámetros de búsqueda
        const searchParams = {
          query: searchTerm,
          country: externalSearchParams.country,
          pages: Math.max(1, Math.min(10, externalSearchParams.numPages)) // Limitar entre 1 y 10 páginas
        };
        
        // Log para depuración
        console.log('Parámetros de búsqueda enviados:', searchParams);
        
        // Llamar al servicio de búsqueda externa
        const data = await jobsService.searchJobsExternalApi(searchParams);
        const jobsArray = Array.isArray(data) ? data : [];
        
        setAllJobs(jobsArray);
        setFilteredJobs(jobsArray);
        setCurrentPage(1);
        setSearchTerm(''); // Limpiar término de búsqueda
        
        AlertUtils.close();
        
        if (jobsArray.length === 0) {
          AlertUtils.info('Sin resultados', 'No se encontraron trabajos con los criterios especificados en la API externa.');
        } else {
          AlertUtils.success('Éxito', `Se encontraron ${jobsArray.length} trabajos desde la API externa.`);
        }
      });
    } catch (err) {
      AlertUtils.close();
      console.error('Error en búsqueda externa:', err);
      await AlertUtils.error('Error en búsqueda externa', 'No se pudo realizar la búsqueda en la API externa. Intenta de nuevo.');
    }
  };

  // Búsqueda en base de datos local
  const handleDatabaseSearch = async () => {
    if (!searchTerm.trim()) {
      loadJobs();
      return;
    }

    try {
      JobAlerts.loadingSearch();
      await executeAsync(async () => {
        // Buscar por título por defecto
        const data = await jobsService.searchJobsByTitle(searchTerm);
        const jobsArray = data || [];
        setAllJobs(jobsArray);
        setFilteredJobs(jobsArray);
        setCurrentPage(1);
        setSearchTerm(''); // Limpiar término de búsqueda
        AlertUtils.close();
        if (jobsArray.length === 0) {
          AlertUtils.info('Sin resultados', `No se encontraron trabajos con el criterio de búsqueda "${searchTerm}".`);
        }
      });
    } catch (err) {
      AlertUtils.close();
      await AlertUtils.error('Error en búsqueda', 'No se pudo realizar la búsqueda. Intenta de nuevo.');
    }
  };

  // Limpiar todas las búsquedas y recargar datos originales
  const handleClearSearch = () => {
    setSearchTerm('');
    setExternalSearchParams({ country: '', numPages: 1 });
    loadJobs();
  };

  const handleDelete = async (id, jobTitle) => {
    const result = await JobAlerts.confirmDelete(jobTitle);
    
    if (result.isConfirmed) {
      try {
        JobAlerts.loadingDelete();
        await executeAsync(async () => {
          await jobsService.deleteJob(id);
          AlertUtils.close();
          await JobAlerts.successDelete(jobTitle);
          loadJobs();
        });
      } catch (err) {
        AlertUtils.close();
        await AlertUtils.error('Error al eliminar', 'No se pudo eliminar el trabajo. Intenta de nuevo.');
      }
    }
  };

  const handleRestore = async (id, jobTitle) => {
    const result = await JobAlerts.confirmRestore(jobTitle);
    
    if (result.isConfirmed) {
      try {
        AlertUtils.loading('Restaurando trabajo...', 'Procesando restauración');
        await executeAsync(async () => {
          await jobsService.restoreJob(id);
          AlertUtils.close();
          await JobAlerts.successRestore(jobTitle);
          loadJobs();
        });
      } catch (err) {
        AlertUtils.close();
        await AlertUtils.error('Error al restaurar', 'No se pudo restaurar el trabajo. Intenta de nuevo.');
      }
    }
  };

  const handleCreate = () => {
    setSelectedJob(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setEditMode(true);
    setShowForm(true);
  };

  const handleView = (job) => {
    setSelectedJob(job);
    setShowDetails(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadJobs();
  };

  // Funciones para manejar la paginación
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Volver a la primera página cuando se cambia el tamaño
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Gestión de Trabajos</h1>
        <button 
          className="btn btn-primary"
          onClick={handleCreate}
        >
          <Plus size={16} />
          Nuevo Trabajo
        </button>
      </div>

      {/* Búsqueda Simplificada */}
      <div className="search-container">
        <h3 className="search-section-title">
          <Search size={18} />
          Búsqueda de Trabajos
        </h3>
        
        {/* Búsqueda en tiempo real */}
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Buscar trabajos por título, empresa, ciudad, país o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="btn btn-clear"
              title="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Parámetros de búsqueda externa (opcionales) */}
        <div className="external-search-params">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">País (opcional):</label>
              <input
                id="country"
                type="text"
                placeholder="Ej: United States, Spain..."
                value={externalSearchParams.country}
                onChange={(e) => setExternalSearchParams(prev => ({ ...prev, country: e.target.value }))}
                className="search-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="numPages">Páginas (opcional):</label>
              <select
                id="numPages"
                value={externalSearchParams.numPages}
                onChange={(e) => setExternalSearchParams(prev => ({ ...prev, numPages: parseInt(e.target.value) }))}
                className="search-select"
              >
                <option value={1}>1 página (~10 trabajos)</option>
                <option value={2}>2 páginas (~20 trabajos)</option>
                <option value={3}>3 páginas (~30 trabajos)</option>
                <option value={4}>4 páginas (~40 trabajos)</option>
                <option value={5}>5 páginas (~50 trabajos)</option>
                <option value={10}>10 páginas (~100 trabajos)</option>
              </select>
            </div>
          </div>
          
          <div className="search-actions">
            <button 
              onClick={handleExternalApiSearch}
              className="btn btn-primary"
              disabled={loading}
            >
              <Search size={16} />
              Buscar en API Externa
            </button>
            <button 
              onClick={handleDatabaseSearch}
              className="btn btn-secondary"
              disabled={loading}
            >
              <Search size={16} />
              Buscar en Base de Datos
            </button>
            <button 
              onClick={handleClearSearch}
              className="btn btn-secondary"
              disabled={loading}
            >
              Limpiar y Recargar
            </button>
          </div>
        </div>
        
        {searchTerm && (
          <p className="search-results-info">
            Mostrando {totalItems} trabajos que coinciden con "{searchTerm}"
          </p>
        )}
      </div>

      {/* Lista de trabajos */}
      {loading && <div className="loading">Cargando...</div>}
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {!loading && totalItems === 0 && (
        <div className="empty-state">
          <p>No se encontraron trabajos</p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <>
          <div className="table-container">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Título</th>
                  <th>Ubicación</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id || job.jobId}>
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
                    <td className="actions">
                      <button
                        onClick={() => handleView(job)}
                        className="btn btn-info btn-sm"
                        title="Ver detalles"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(job)}
                        className="btn btn-warning btn-sm"
                        title="Editar"
                      >
                        <Edit size={14} />
                      </button>
                      {job.isActive !== false ? (
                        <button
                          onClick={() => handleDelete(job.id, job.jobTitle)}
                          className="btn btn-danger btn-sm"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(job.id, job.jobTitle)}
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

      {/* Modal de formulario */}
      {showForm && (
        <JobForm
          job={selectedJob}
          isEdit={editMode}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Modal de detalles */}
      {showDetails && (
        <JobDetails
          job={selectedJob}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default JobsList;