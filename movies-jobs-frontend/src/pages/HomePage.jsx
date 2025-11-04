import React from 'react';
import { Film, Briefcase, Database, Zap, Shield, Search, Star, Users, TrendingUp, MapPin, Calendar, ExternalLink } from 'lucide-react';

const HomePage = ({ setActiveTab }) => {
  const features = [
    {
      icon: Film,
      title: 'Gestión de Películas',
      description: 'CRUD completo para películas con búsqueda avanzada, calificaciones, detalles y gestión de géneros probando pipelines.',
      action: () => setActiveTab('movies'),
      buttonText: 'Explorar Películas',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Briefcase,
      title: 'Gestión de Trabajos',
      description: 'Administra ofertas laborales con filtros avanzados por empresa, ubicación, tipo de empleo y salario.',
      action: () => setActiveTab('jobs'),
      buttonText: 'Ver Oportunidades',
      gradient: 'from-blue-500 to-teal-500'
    }
  ];



  const statistics = [
    { icon: Star, label: 'Calificación', value: '4.9/5', color: 'text-yellow-500' },
    { icon: Users, label: 'Usuarios Activos', value: '1,200+', color: 'text-blue-500' },
    { icon: TrendingUp, label: 'Crecimiento', value: '+25%', color: 'text-green-500' },
    { icon: Database, label: 'Registros', value: '50K+', color: 'text-purple-500' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Sistema de Gestión Integral</h1>
        <p className="hero-subtitle">
          Plataforma moderna para la administración eficiente de películas y oportunidades laborales
        </p>
        
        {/* Statistics */}
        <div className="statistics-grid">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-item">
                <div className={`stat-icon ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Actions */}
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
                  <ExternalLink size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="footer-info">
        <div className="tech-stack">
          <h3>Tecnologías Utilizadas</h3>
          <div className="tech-badges">
            <span className="tech-badge">React 18</span>
            <span className="tech-badge">Vite</span>
            <span className="tech-badge">Spring Boot</span>
            <span className="tech-badge">PostgreSQL</span>
            <span className="tech-badge">Axios</span>
            <span className="tech-badge">Lucide Icons</span>
          </div><br />
          <h3>@developer luis valle</h3>
        </div>
      </div>
    </div>
  );
};

export default HomePage;