import React, { useState, useEffect, useRef } from 'react';
import HomePage from './components/HomePage';
import Navigation from './components/Navigation';
import ProgressionApp from './components/ProgressionApp';
import { progressionConfigs } from './data/progressionConfigs';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-white">
            ISPA Amiens - Progressions FLE 🚧 DEV
          </h1>
          <p className="text-white/70 text-sm mt-2">
            Institut Supérieur de Propédeutique d'Amiens • Version Développement
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'a1a2' && <ProgressionApp config={progressionConfigs.a1a2} />}
        {currentPage === 'a2b1' && <ProgressionApp config={progressionConfigs.a2b1} />}
        {currentPage === 'b1b2' && <ProgressionApp config={progressionConfigs.b1b2} />}
        {currentPage === 'a2emploi' && <ProgressionApp config={progressionConfigs.a2emploi} />}
      </main>

      <footer className="text-center text-white/70 py-8">
        © ISPA Amiens - Progressions FLE. Interface locale, aucune donnée transmise.
      </footer>
    </div>
  );
}