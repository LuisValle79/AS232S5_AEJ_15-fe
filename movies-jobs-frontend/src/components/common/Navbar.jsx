import React from 'react';
import { Film, Briefcase, Home } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'movies', label: 'Películas', icon: Film },
    { id: 'jobs', label: 'Trabajos', icon: Briefcase }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Movies & Jobs CRUD</h1>
        <span className="subtitle">Sistema de Gestión</span>
      </div>
      
      <div className="navbar-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;