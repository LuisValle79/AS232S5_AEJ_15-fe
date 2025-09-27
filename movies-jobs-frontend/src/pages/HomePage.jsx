import React from 'react';
import { Film, Briefcase, Database, Zap, Shield, Search } from 'lucide-react';

const HomePage = ({ setActiveTab }) => {
  const features = [
    {
      icon: Film,
      title: 'Gestión de Películas',
      description: 'CRUD completo para películas con búsqueda avanzada, calificaciones y detalles.',
      action: () => setActiveTab('movies'),
      buttonText: 'Ver Películas'
    },
    {
      icon: Briefcase,
      title: 'Gestión de Trabajos',
      description: 'Administra ofertas de trabajo con filtros por empresa, ubicación y tipo.',
      action: () => setActiveTab('jobs'),
      buttonText: 'Ver Trabajos'
    }
  ];

  const systemFeatures = [
    {
      icon: Database,
      title: 'CRUD Completo',
      description: 'Crear, leer, actualizar y eliminar registros de forma segura'
    },
    {
      icon: Shield,
      title: 'Eliminado Lógico',
      description: 'Los datos no se pierden, se pueden restaurar cuando sea necesario'
    },
    {
      icon: Search,
      title: 'Búsqueda Avanzada',
      description: 'Encuentra información rápidamente con múltiples filtros'
    },
    {
      icon: Zap,
      title: 'Interfaz Moderna',
      description: 'Diseño responsive y fácil de usar con React y Vite'
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Bienvenido al Sistema CRUD</h1>
        <p className="hero-subtitle">
          Gestiona películas y trabajos de forma eficiente con nuestra plataforma integrada
        </p>
        
        <div className="quick-actions">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="action-card">
                <div className="action-icon">
                  <Icon size={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button 
                  onClick={feature.action}
                  className="btn btn-primary"
                >
                  {feature.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="features-section">
        <h2>Características del Sistema</h2>
        <div className="features-grid">
          {systemFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <Icon size={24} />
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="api-info">
        <h2>APIs Integradas</h2>
        <div className="api-cards">
          <div className="api-card">
            <h3>Movies API</h3>
            <div className="api-endpoints">
              <span className="endpoint">GET /api/movies</span>
              <span className="endpoint">POST /api/movies</span>
              <span className="endpoint">PUT /api/movies/{'{id}'}</span>
              <span className="endpoint">DELETE /api/movies/{'{id}'}</span>
            </div>
          </div>
          <div className="api-card">
            <h3>Jobs API</h3>
            <div className="api-endpoints">
              <span className="endpoint">GET /api/jobs</span>
              <span className="endpoint">POST /api/jobs</span>
              <span className="endpoint">PUT /api/jobs/{'{id}'}</span>
              <span className="endpoint">DELETE /api/jobs/{'{id}'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;