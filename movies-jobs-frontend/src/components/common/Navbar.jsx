import React from 'react';
import { Film, Briefcase, Home, Sparkles, Trash2 } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: Home, description: 'Página principal' },
    { id: 'movies', label: 'Películas', icon: Film, description: 'Gestión de películas' },
    { id: 'jobs', label: 'Trabajos', icon: Briefcase, description: 'Oportunidades laborales' },
    { id: 'deleted-movies', label: 'Películas Eliminadas', icon: Trash2, description: 'Películas en papelera' },
    { id: 'deleted-jobs', label: 'Trabajos Eliminados', icon: Trash2, description: 'Trabajos en papelera' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <Sparkles size={28} />
        </div>
        <div className="brand-text">
          <h1>Portal de Peliculas & Trabajos</h1>
          <span className="subtitle">Sistema de Gestión Integral</span>
        </div>
      </div>
      
      <div className="navbar-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              title={tab.description}
            >
              <Icon size={18} />
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="active-indicator" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;