import React from 'react';

// Système de sauvegarde partagée amélioré pour synchronisation entre navigateurs
export interface SharedStateManager {
  saveToShared: (key: string, data: any) => void;
  loadFromShared: (key: string) => any;
  subscribeToChanges: (key: string, callback: (data: any) => void) => () => void;
  exportAllData: () => string;
  importAllData: (data: string) => boolean;
}

// Gestionnaire de sauvegarde locale avec export/import pour synchronisation manuelle
class LocalSharedStateManager implements SharedStateManager {
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private lastModified: Map<string, number> = new Map();

  saveToShared(key: string, data: any): void {
    // Ajouter un timestamp pour suivre les modifications
    const dataWithTimestamp = {
      ...data,
      lastModified: Date.now(),
      version: (data.version || 0) + 1,
      deviceId: this.getDeviceId()
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

  // Générer un ID unique pour l'appareil/navigateur
  private getDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  // Exporter toutes les données pour synchronisation manuelle
  exportAllData(): string {
    const allData: Record<string, any> = {};
    const keys = ['progA1A2', 'progA2B1', 'progB1B2', 'progA2Emploi'];
    
    keys.forEach(key => {
      const data = this.loadFromShared(key);
      if (data) {
        allData[key] = data;
      }
    });
    
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      deviceId: this.getDeviceId(),
      version: '1.0',
      data: allData
    }, null, 2);
  }

  // Importer toutes les données
  importAllData(jsonData: string): boolean {
    try {
      const importedData = JSON.parse(jsonData);
      
      if (!importedData.data || typeof importedData.data !== 'object') {
        return false;
      }
      
      Object.entries(importedData.data).forEach(([key, data]) => {
        if (data && typeof data === 'object') {
          // Marquer comme importé avec timestamp actuel
          const dataWithImportInfo = {
            ...data,
            lastModified: Date.now(),
            importedFrom: importedData.deviceId || 'unknown',
            importedAt: new Date().toISOString()
          };
          
          localStorage.setItem(key, JSON.stringify(dataWithImportInfo));
          this.lastModified.set(key, dataWithImportInfo.lastModified);
          
          // Notifier les listeners
          const listeners = this.listeners.get(key);
          if (listeners) {
            listeners.forEach(callback => callback(dataWithImportInfo));
          }
        }
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      return false;
    }
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
// Fonctions utilitaires pour la synchronisation manuelle
export function exportAllProgressions(): string {
  return sharedStateManager.exportAllData();
}

export function importAllProgressions(jsonData: string): boolean {
  return sharedStateManager.importAllData(jsonData);
}

export function downloadAllProgressions(): void {
  const data = exportAllProgressions();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ispa-progressions-sync-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}