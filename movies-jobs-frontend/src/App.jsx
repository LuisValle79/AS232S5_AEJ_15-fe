import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/common/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import MoviesList from './components/movies/MoviesList.jsx';
import JobsList from './components/jobs/JobsList.jsx';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'movies':
        return <MoviesList />;
      case 'jobs':
        return <JobsList />;
      case 'home':
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
