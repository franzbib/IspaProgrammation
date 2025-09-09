import React from 'react';
import { BookOpen, Users, Briefcase, GraduationCap, Home } from 'lucide-react';
import { hasRecentChanges } from '../utils/sharedState';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  {
    id: 'home',
    label: 'Accueil',
    icon: Home,
    description: 'ISPA Amiens',
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'a1a2',
    label: 'A1→A2',
    icon: GraduationCap,
    description: 'Débutant vers Élémentaire',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'a2b1',
    label: 'A2→B1',
    icon: BookOpen,
    description: 'Élémentaire vers Intermédiaire',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'b1b2',
    label: 'B1→B2',
    icon: Users,
    description: 'Intermédiaire vers Avancé',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'a2emploi',
    label: 'A2→Emploi',
    icon: Briefcase,
    description: 'Insertion Professionnelle',
    color: 'from-orange-500 to-red-600'
  }
];

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [recentChanges, setRecentChanges] = React.useState<Record<string, boolean>>({});

  // Vérifier les modifications récentes toutes les 30 secondes
  React.useEffect(() => {
    const checkRecentChanges = () => {
      const changes: Record<string, boolean> = {};
      navigationItems.forEach(item => {
        if (item.id !== 'home') {
          const storageKey = item.id === 'a1a2' ? 'progA1A2' : 
                           item.id === 'a2b1' ? 'progA2B1' : 
                           item.id === 'b1b2' ? 'progB1B2' : 
                           item.id === 'a2emploi' ? 'progA2Emploi' : '';
          if (storageKey) {
            changes[item.id] = hasRecentChanges(storageKey, 30);
          }
        }
      });
      setRecentChanges(changes);
    };

    checkRecentChanges();
    const interval = setInterval(checkRecentChanges, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        🎯 Progressions FLE
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const hasRecent = recentChanges[item.id];
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`
                relative p-4 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105` 
                  : 'bg-white/50 hover:bg-white/70 text-gray-700 hover:shadow-md hover:scale-102'
                }
              `}
            >
              <div className="flex flex-col items-center text-center">
                <Icon className={`w-8 h-8 mb-2 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                <div className={`font-bold text-lg ${isActive ? 'text-white' : 'text-gray-800'}`}>
                  {item.label}
                </div>
                <div className={`text-sm ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                  {item.description}
                </div>
                
                {hasRecent && !isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" 
                       title="Modifications récentes">
                  </div>
                )}
              </div>
              
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Cliquez sur une progression pour la modifier
      </div>
    </nav>
  );
}