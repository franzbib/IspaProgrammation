import React, { useState } from 'react';
import { Lock, Eye, Edit, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (mode: 'view' | 'edit') => void;
}

export default function AuthModal({ isOpen, onClose, onAuthenticate }: AuthModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleViewMode = () => {
    onAuthenticate('view');
    onClose();
  };

  const handleEditMode = () => {
    if (!password.trim()) {
      setError('Veuillez saisir le mot de passe');
      return;
    }

    setIsLoading(true);
    
    // Simulation d'une vérification (en production, ceci serait sécurisé côté serveur)
    setTimeout(() => {
      if (password === 'ispa') {
        onAuthenticate('edit');
        onClose();
        setPassword('');
        setError('');
      } else {
        setError('Mot de passe incorrect');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditMode();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Mode d'Accès
          </h2>
          <p className="text-gray-600">
            Choisissez votre mode d'utilisation
          </p>
        </div>

        <div className="space-y-4">
          {/* Mode Consultation */}
          <button
            onClick={handleViewMode}
            className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 group-hover:text-green-700">
                  Mode Consultation
                </h3>
                <p className="text-sm text-gray-600">
                  Visualiser les progressions (lecture seule)
                </p>
              </div>
            </div>
          </button>

          {/* Mode Modification */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Edit className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800">
                  Mode Modification
                </h3>
                <p className="text-sm text-gray-600">
                  Modifier, ajouter, supprimer des étiquettes
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="password"
                placeholder="Mot de passe requis..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                disabled={isLoading}
              />

              {error && (
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                  {error}
                </p>
              )}

              <button
                onClick={handleEditMode}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isLoading ? 'Vérification...' : 'Accéder au Mode Modification'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          🔒 Version Développement ISPA
        </div>
      </div>
    </div>
  );
}