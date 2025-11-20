import React, { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { jobsService } from '../../services/jobsService.js';
import { useApiState, useForm } from '../../hooks/useApi.js';
import { validationRules } from '../../utils/validation.js';
import { JobAlerts, AlertUtils } from '../../utils/sweetAlert.js';

const JobForm = ({ job, isEdit, onSuccess, onCancel }) => {
  const { loading, executeAsync } = useApiState();

  const initialState = {
    jobId: '',
    employerName: '',
    jobTitle: '',
    jobDescription: '',
    jobCountry: '',
    jobCity: '',
    jobPostedAt: '',
    jobApplyLink: '',
    jobEmploymentType: ''
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
  } = useForm(initialState, validationRules.job);

  useEffect(() => {
    if (isEdit && job) {
      setValues({
        jobId: job.jobId || '',
        employerName: job.employerName || '',
        jobTitle: job.jobTitle || '',
        jobDescription: job.jobDescription || '',
        jobCountry: job.jobCountry || '',
        jobCity: job.jobCity || '',
        jobPostedAt: job.jobPostedAt ? job.jobPostedAt.split('T')[0] : '',
        jobApplyLink: job.jobApplyLink || '',
        jobEmploymentType: job.jobEmploymentType || ''
      });
    }
  }, [job, isEdit, setValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      await AlertUtils.warning('¡Formulario incompleto!', 'Por favor corrige los errores marcados en rojo antes de continuar.');
      return;
    }

    // Confirmación antes de guardar
    const confirmResult = await AlertUtils.confirmSave(
      isEdit ? '¿Actualizar trabajo?' : '¿Crear nuevo trabajo?',
      isEdit ? `Se actualizará la información de "${values.jobTitle}"` : `Se creará el trabajo "${values.jobTitle}"`
    );

    if (!confirmResult.isConfirmed) return;

    try {
      // Mostrar loading apropiado
      if (isEdit) {
        JobAlerts.loadingUpdate();
      } else {
        JobAlerts.loadingCreate();
      }

      await executeAsync(async () => {
        if (isEdit) {
          await jobsService.updateJob(job.id, values);
          AlertUtils.close();
          await JobAlerts.successUpdate(values.jobTitle);
        } else {
          await jobsService.createJob(values);
          AlertUtils.close();
          await JobAlerts.successCreate(values.jobTitle);
        }

        onSuccess();
      });
    } catch (err) {
      AlertUtils.close();
      await JobAlerts.errorSave();
    }
  };

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship',
    'Freelance'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEdit ? 'Editar Trabajo' : 'Nuevo Trabajo'}</h2>
          <button onClick={onCancel} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-grid">
            {/* Job ID */}
            <div className="form-group">
              <label htmlFor="jobId">Job ID *</label>
              <input
                type="text"
                id="jobId"
                name="jobId"
                value={values.jobId}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isEdit}
                className={errors.jobId && touched.jobId ? 'error' : ''}
              />
              {errors.jobId && touched.jobId && (
                <span className="error-text">{errors.jobId}</span>
              )}
            </div>

            {/* Nombre de la empresa */}
            <div className="form-group">
              <label htmlFor="employerName">Empresa *</label>
              <input
                type="text"
                id="employerName"
                name="employerName"
                value={values.employerName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.employerName && touched.employerName ? 'error' : ''}
              />
              {errors.employerName && touched.employerName && (
                <span className="error-text">{errors.employerName}</span>
              )}
            </div>

            {/* Título del trabajo */}
            <div className="form-group">
              <label htmlFor="jobTitle">Título del Trabajo *</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={values.jobTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.jobTitle && touched.jobTitle ? 'error' : ''}
              />
              {errors.jobTitle && touched.jobTitle && (
                <span className="error-text">{errors.jobTitle}</span>
              )}
            </div>

            {/* País */}
            <div className="form-group">
              <label htmlFor="jobCountry">País *</label>
              <input
                type="text"
                id="jobCountry"
                name="jobCountry"
                value={values.jobCountry}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.jobCountry && touched.jobCountry ? 'error' : ''}
              />
              {errors.jobCountry && touched.jobCountry && (
                <span className="error-text">{errors.jobCountry}</span>
              )}
            </div>

            {/* Ciudad */}
            <div className="form-group">
              <label htmlFor="jobCity">Ciudad *</label>
              <input
                type="text"
                id="jobCity"
                name="jobCity"
                value={values.jobCity}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.jobCity && touched.jobCity ? 'error' : ''}
              />
              {errors.jobCity && touched.jobCity && (
                <span className="error-text">{errors.jobCity}</span>
              )}
            </div>

            {/* Fecha de publicación */}
            <div className="form-group">
              <label htmlFor="jobPostedAt">Fecha de Publicación</label>
              <input
                type="date"
                id="jobPostedAt"
                name="jobPostedAt"
                value={values.jobPostedAt}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.jobPostedAt && touched.jobPostedAt ? 'error' : ''}
              />
              {errors.jobPostedAt && touched.jobPostedAt && (
                <span className="error-text">{errors.jobPostedAt}</span>
              )}
            </div>

            {/* Tipo de empleo */}
            <div className="form-group">
              <label htmlFor="jobEmploymentType">Tipo de Empleo</label>
              <select
                id="jobEmploymentType"
                name="jobEmploymentType"
                value={values.jobEmploymentType}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.jobEmploymentType && touched.jobEmploymentType ? 'error' : ''}
              >
                <option value="">Seleccionar tipo</option>
                {employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.jobEmploymentType && touched.jobEmploymentType && (
                <span className="error-text">{errors.jobEmploymentType}</span>
              )}
            </div>

            {/* Link de aplicación */}
            <div className="form-group">
              <label htmlFor="jobApplyLink">Link de Aplicación</label>
              <input
                type="url"
                id="jobApplyLink"
                name="jobApplyLink"
                value={values.jobApplyLink}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.jobApplyLink && touched.jobApplyLink ? 'error' : ''}
                placeholder="https://ejemplo.com/aplicar"
              />
              {errors.jobApplyLink && touched.jobApplyLink && (
                <span className="error-text">{errors.jobApplyLink}</span>
              )}
            </div>
          </div>

          {/* Descripción del trabajo */}
          <div className="form-group">
            <label htmlFor="jobDescription">Descripción del Trabajo</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              rows="6"
              value={values.jobDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.jobDescription && touched.jobDescription ? 'error' : ''}
              placeholder="Descripción detallada del trabajo, responsabilidades, requisitos..."
            />
            {errors.jobDescription && touched.jobDescription && (
              <span className="error-text">{errors.jobDescription}</span>
            )}
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

export default JobForm;