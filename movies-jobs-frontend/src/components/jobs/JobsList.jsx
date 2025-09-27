import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, RotateCcw, Eye, MapPin, Building } from 'lucide-react';
import { toast } from 'react-toastify';
import { jobsService } from '../../services/jobsService.js';
import { useApiState } from '../../hooks/useApi.js';
import { truncateText, formatDate } from '../../utils/validation.js';
import JobForm from './JobForm.jsx';
import JobDetails from './JobDetails.jsx';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title'); // title, employer, country, city
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { loading, error, executeAsync } = useApiState();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      await executeAsync(async () => {
        const data = await jobsService.getAllJobs();
        console.log('Jobs data received:', data);
        setJobs(Array.isArray(data) ? data : []);
      });
    } catch (err) {
      console.error('Error loading jobs:', err);
      toast.error(`Error al cargar los trabajos: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadJobs();
      return;
    }

    try {
      await executeAsync(async () => {
        let data;
        switch (searchType) {
          case 'title':
            data = await jobsService.searchJobsByTitle(searchTerm);
            break;
          case 'employer':
            data = await jobsService.searchJobsByEmployer(searchTerm);
            break;
          case 'country':
            data = await jobsService.searchJobsByCountry(searchTerm);
            break;
          case 'city':
            data = await jobsService.searchJobsByCity(searchTerm);
            break;
          default:
            data = await jobsService.searchJobsByTitle(searchTerm);
        }
        setJobs(data || []);
      });
    } catch (err) {
      toast.error('Error en la búsqueda');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este trabajo?')) return;

    try {
      await executeAsync(async () => {
        await jobsService.deleteJob(id);
        toast.success('Trabajo eliminado correctamente');
        loadJobs();
      });
    } catch (err) {
      toast.error('Error al eliminar el trabajo');
    }
  };

  const handleRestore = async (id) => {
    try {
      await executeAsync(async () => {
        await jobsService.restoreJob(id);
        toast.success('Trabajo restaurado correctamente');
        loadJobs();
      });
    } catch (err) {
      toast.error('Error al restaurar el trabajo');
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

      {/* Búsqueda */}
      <div className="search-container">
        <div className="search-controls">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-select"
          >
            <option value="title">Por Título</option>
            <option value="employer">Por Empresa</option>
            <option value="country">Por País</option>
            <option value="city">Por Ciudad</option>
          </select>
          
          <div className="search-input-group">
            <input
              type="text"
              placeholder={`Buscar trabajos por ${searchType === 'title' ? 'título' : 
                searchType === 'employer' ? 'empresa' : 
                searchType === 'country' ? 'país' : 'ciudad'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="search-input"
            />
            <button 
              onClick={handleSearch}
              className="btn btn-secondary"
              disabled={loading}
            >
              <Search size={16} />
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de trabajos */}
      {loading && <div className="loading">Cargando...</div>}
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron trabajos</p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="table-container">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>ID</th>
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
                        onClick={() => handleDelete(job.id)}
                        className="btn btn-danger btn-sm"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(job.id)}
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