import React, { useState, useEffect, useRef } from 'react';
import AuthModal from './components/AuthModal';
import HomePage from './components/HomePage';
import Navigation from './components/Navigation';
import ProgressionApp from './components/ProgressionApp';
import { progressionConfigs } from './data/progressionConfigs';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [authMode, setAuthMode] = useState<'none' | 'view' | 'edit'>('none');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPage, setPendingPage] = useState<string | null>(null);

  const handlePageChange = (page: string) => {
    if (page === 'home') {
      setCurrentPage(page);
      return;
    }

    // Pour les pages de progression, vérifier l'authentification
    if (authMode === 'none') {
      setPendingPage(page);
      setShowAuthModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  const handleAuthenticate = (mode: 'view' | 'edit') => {
    setAuthMode(mode);
    if (pendingPage) {
      setCurrentPage(pendingPage);
      setPendingPage(null);
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setPendingPage(null);
  };

  const isReadOnly = authMode === 'view';

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
        <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
        
        {/* Auth Status Indicator */}
        {authMode !== 'none' && currentPage !== 'home' && (
          <div className="mb-6 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              authMode === 'edit' 
                ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                : 'bg-green-100 text-green-800 border border-green-200'
            }`}>
              {authMode === 'edit' ? '✏️ Mode Modification' : '👁️ Mode Consultation'}
              <button
                onClick={() => {
                  setAuthMode('none');
                  setCurrentPage('home');
                }}
                className="ml-2 text-xs underline hover:no-underline"
              >
                Changer de mode
              </button>
            </div>
          </div>
        )}
        
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'a1a2' && <ProgressionApp config={progressionConfigs.a1a2} isReadOnly={isReadOnly} />}
        {currentPage === 'a2b1' && <ProgressionApp config={progressionConfigs.a2b1} isReadOnly={isReadOnly} />}
        {currentPage === 'b1b2' && <ProgressionApp config={progressionConfigs.b1b2} isReadOnly={isReadOnly} />}
        {currentPage === 'a2emploi' && <ProgressionApp config={progressionConfigs.a2emploi} isReadOnly={isReadOnly} />}
      </main>

      <footer className="text-center text-white/70 py-8">
        © ISPA Amiens - Progressions FLE. Interface locale, aucune donnée transmise.
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        onAuthenticate={handleAuthenticate}
      />
    </div>
  );
}