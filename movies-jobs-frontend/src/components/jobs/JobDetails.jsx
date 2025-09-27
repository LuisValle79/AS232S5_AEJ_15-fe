import React from 'react';
import { X, Building, MapPin, Calendar, ExternalLink, Briefcase } from 'lucide-react';
import { formatDate } from '../../utils/validation.js';

const JobDetails = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-large">
        <div className="modal-header">
          <h2>Detalles del Trabajo</h2>
          <button onClick={onClose} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <div className="job-details">
          <div className="job-details-content">
            {/* Información principal */}
            <div className="job-main-info">
              <div className="job-header">
                <h3>{job.jobTitle}</h3>
                <div className="job-company">
                  <Building size={18} />
                  <span>{job.employerName}</span>
                </div>
                <p className="job-id">ID: {job.jobId}</p>
              </div>

              {job.jobDescription && (
                <div className="job-description">
                  <h4>Descripción</h4>
                  <div className="description-content">
                    {job.jobDescription.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Información del trabajo */}
            <div className="job-info-cards">
              <div className="info-card">
                <div className="info-card-icon">
                  <MapPin size={24} />
                </div>
                <div className="info-card-content">
                  <span className="info-label">Ubicación</span>
                  <span className="info-value">
                    {job.jobCity}, {job.jobCountry}
                  </span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Briefcase size={24} />
                </div>
                <div className="info-card-content">
                  <span className="info-label">Tipo de Empleo</span>
                  <span className="info-value">
                    {job.jobEmploymentType || 'No especificado'}
                  </span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Calendar size={24} />
                </div>
                <div className="info-card-content">
                  <span className="info-label">Fecha de Publicación</span>
                  <span className="info-value">
                    {job.jobPostedAt ? formatDate(job.jobPostedAt) : 'No especificada'}
                  </span>
                </div>
              </div>

              {job.jobApplyLink && (
                <div className="info-card">
                  <div className="info-card-icon">
                    <ExternalLink size={24} />
                  </div>
                  <div className="info-card-content">
                    <span className="info-label">Aplicar</span>
                    <a 
                      href={job.jobApplyLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="apply-link"
                    >
                      Ver oferta completa
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="job-additional-info">
              {job.createdAt && (
                <div className="info-item">
                  <span className="info-label">Creado:</span>
                  <span className="info-value">{formatDate(job.createdAt)}</span>
                </div>
              )}

              {job.updatedAt && (
                <div className="info-item">
                  <span className="info-label">Actualizado:</span>
                  <span className="info-value">{formatDate(job.updatedAt)}</span>
                </div>
              )}

              <div className="info-item">
                <span className="info-label">Estado:</span>
                <span className={`status-badge ${job.isActive !== false ? 'active' : 'inactive'}`}>
                  {job.isActive !== false ? 'Activo' : 'Eliminado'}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            {job.jobApplyLink && (
              <a 
                href={job.jobApplyLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-success"
              >
                <ExternalLink size={16} />
                Aplicar al trabajo
              </a>
            )}
            <button onClick={onClose} className="btn btn-primary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;