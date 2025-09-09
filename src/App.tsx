import React, { useState } from 'react';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import ProgressionApp from './components/ProgressionApp';
import HomePage from './components/HomePage';
import { progressionConfigs } from './data/progressionConfigs';

export default function App() {
  // Récupérer la dernière page visitée depuis localStorage
  const [currentPage, setCurrentPage] = useState<string>(() => {
    return localStorage.getItem('lastVisitedPage') || 'home';
  });

  // Sauvegarder la page courante à chaque changement
  useEffect(() => {
    localStorage.setItem('lastVisitedPage', currentPage);
  }, [currentPage]);

  if (currentPage !== 'home' && !progressionConfigs[currentPage]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration non trouvée</h1>
          <button 
            onClick={() => setCurrentPage('home')}
            className="px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const currentConfig = progressionConfigs[currentPage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentPage === 'home' ? 'ISPA Amiens - Progressions FLE' : currentConfig.title}
          </h1>
          <p className="text-white/70 text-sm mt-2">
            {currentPage === 'home' 
              ? 'Institut Supérieur de Préparation et d\'Accompagnement • École de langue française'
              : `${currentConfig.subtitle} • Organisez les thèmes et points de grammaire par glisser‑déposer`
            }
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        {currentPage === 'home' ? (
          <HomePage />
        ) : (
          <ProgressionApp config={currentConfig} />
        )}
      </main>

      <footer className="text-center text-white/70 py-8">
        © ISPA Amiens - Progressions annuelles FLE. Interface locale, aucune donnée transmise.
      </footer>
    </div>
  );
}