// Système de sauvegarde partagée pour que les modifications soient visibles par tous les utilisateurs
export interface SharedStateManager {
  saveToShared: (key: string, data: any) => void;
  loadFromShared: (key: string) => any;
  subscribeToChanges: (key: string, callback: (data: any) => void) => () => void;
}

// Simulation d'un système de sauvegarde partagée
// En production, ceci pourrait être remplacé par une base de données ou un service cloud
class LocalSharedStateManager implements SharedStateManager {
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private lastModified: Map<string, number> = new Map();

  saveToShared(key: string, data: any): void {
    // Ajouter un timestamp pour suivre les modifications
    const dataWithTimestamp = {
      ...data,
      lastModified: Date.now(),
      version: (data.version || 0) + 1
    };
    
    localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
    this.lastModified.set(key, dataWithTimestamp.lastModified);
    
    // Notifier tous les listeners
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(dataWithTimestamp);
        } catch (error) {
          console.warn('Erreur lors de la notification du listener:', error);
        }
      });
    }
    
    // Déclencher un événement storage pour synchroniser entre onglets
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue: JSON.stringify(dataWithTimestamp),
      storageArea: localStorage
    }));
  }

  loadFromShared(key: string): any {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const data = JSON.parse(stored);
        this.lastModified.set(key, data.lastModified || 0);
        return data;
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des données partagées:', error);
    }
    return null;
  }

  subscribeToChanges(key: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key)!.add(callback);
    
    // Écouter les changements du localStorage (synchronisation entre onglets)
    const storageListener = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          const currentTimestamp = this.lastModified.get(key) || 0;
          
          // Ne notifier que si c'est une modification plus récente
          if (data.lastModified > currentTimestamp) {
            this.lastModified.set(key, data.lastModified);
            callback(data);
          }
        } catch (error) {
          console.warn('Erreur lors de la synchronisation:', error);
        }
      }
    };
    
    window.addEventListener('storage', storageListener);
    
    // Fonction de désabonnement
    return () => {
      this.listeners.get(key)?.delete(callback);
      window.removeEventListener('storage', storageListener);
    };
  }

  // Méthode utilitaire pour obtenir la dernière modification
  getLastModified(key: string): number {
    return this.lastModified.get(key) || 0;
  }

  // Méthode pour forcer la synchronisation
  forceSyncAll(): void {
    const keys = ['progA1A2', 'progA2B1', 'progB1B2', 'progA2Emploi'];
    keys.forEach(key => {
      const data = this.loadFromShared(key);
      if (data) {
        const listeners = this.listeners.get(key);
        if (listeners) {
          listeners.forEach(callback => callback(data));
        }
      }
    });
  }
}

// Instance singleton
export const sharedStateManager = new LocalSharedStateManager();

// Hook pour faciliter l'utilisation dans les composants React
export function useSharedState<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [state, setState] = React.useState<T>(() => {
    const shared = sharedStateManager.loadFromShared(key);
    return shared || initialValue;
  });

  React.useEffect(() => {
    // S'abonner aux changements
    const unsubscribe = sharedStateManager.subscribeToChanges(key, (data) => {
      setState(data);
    });

    return unsubscribe;
  }, [key]);

  const setSharedState = React.useCallback((value: T) => {
    setState(value);
    sharedStateManager.saveToShared(key, value);
  }, [key]);

  return [state, setSharedState];
}

// Fonction utilitaire pour vérifier si des données ont été modifiées récemment
export function hasRecentChanges(key: string, withinMinutes: number = 5): boolean {
  const lastModified = sharedStateManager.getLastModified(key);
  const now = Date.now();
  const threshold = withinMinutes * 60 * 1000; // Convertir en millisecondes
  
  return (now - lastModified) < threshold;
}

// Fonction pour obtenir un résumé des dernières modifications
export function getModificationSummary(): { key: string; lastModified: Date; hasRecent: boolean }[] {
  const keys = ['progA1A2', 'progA2B1', 'progB1B2', 'progA2Emploi'];
  
  return keys.map(key => ({
    key,
    lastModified: new Date(sharedStateManager.getLastModified(key)),
    hasRecent: hasRecentChanges(key, 30) // Modifications dans les 30 dernières minutes
  }));
}