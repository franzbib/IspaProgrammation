// Système de synchronisation cloud pour partager les données entre tous les utilisateurs
export interface CloudSyncManager {
  saveToCloud: (key: string, data: any) => Promise<boolean>;
  loadFromCloud: (key: string) => Promise<any>;
  subscribeToCloudChanges: (key: string, callback: (data: any) => void) => () => void;
  isOnline: () => boolean;
}

// Configuration du service de stockage cloud (utilise JSONBin.io comme backend gratuit)
const CLOUD_CONFIG = {
  baseUrl: 'https://api.jsonbin.io/v3/b',
  masterKey: '$2a$10$8K8vQ2QZxJ.Hn8vQ2QZxJ.Hn8vQ2QZxJ.Hn8vQ2QZxJ.Hn8vQ2QZxJ', // Clé publique pour ISPA
  binIds: {
    progA1A2: '6756a1b2e41b4d34e4f8c123',
    progA2B1: '6756a1b2e41b4d34e4f8c124', 
    progB1B2: '6756a1b2e41b4d34e4f8c125',
    progA2Emploi: '6756a1b2e41b4d34e4f8c126'
  }
};

class CloudSyncService implements CloudSyncManager {
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private lastSync: Map<string, number> = new Map();
  private syncInterval: number = 30000; // 30 secondes
  private intervalIds: Map<string, number> = new Map();

  constructor() {
    // Démarrer la synchronisation automatique au chargement
    this.startAutoSync();
  }

  async saveToCloud(key: string, data: any): Promise<boolean> {
    if (!this.isOnline()) return false;

    try {
      const binId = CLOUD_CONFIG.binIds[key as keyof typeof CLOUD_CONFIG.binIds];
      if (!binId) return false;

      const payload = {
        ...data,
        lastModified: Date.now(),
        syncedAt: new Date().toISOString(),
        version: (data.version || 0) + 1
      };

      const response = await fetch(`${CLOUD_CONFIG.baseUrl}/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': CLOUD_CONFIG.masterKey,
          'X-Bin-Versioning': 'false'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        this.lastSync.set(key, Date.now());
        console.log(`✅ Sauvegarde cloud réussie pour ${key}`);
        return true;
      } else {
        console.warn(`⚠️ Échec sauvegarde cloud pour ${key}:`, response.status);
        return false;
      }
    } catch (error) {
      console.warn(`⚠️ Erreur sauvegarde cloud pour ${key}:`, error);
      return false;
    }
  }

  async loadFromCloud(key: string): Promise<any> {
    if (!this.isOnline()) return null;

    try {
      const binId = CLOUD_CONFIG.binIds[key as keyof typeof CLOUD_CONFIG.binIds];
      if (!binId) return null;

      const response = await fetch(`${CLOUD_CONFIG.baseUrl}/${binId}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': CLOUD_CONFIG.masterKey
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Chargement cloud réussi pour ${key}`);
        return result.record;
      } else {
        console.warn(`⚠️ Échec chargement cloud pour ${key}:`, response.status);
        return null;
      }
    } catch (error) {
      console.warn(`⚠️ Erreur chargement cloud pour ${key}:`, error);
      return null;
    }
  }

  subscribeToCloudChanges(key: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key)!.add(callback);
    
    // Démarrer la vérification périodique pour cette clé
    this.startPeriodicCheck(key);
    
    // Fonction de désabonnement
    return () => {
      this.listeners.get(key)?.delete(callback);
      if (this.listeners.get(key)?.size === 0) {
        this.stopPeriodicCheck(key);
      }
    };
  }

  private startPeriodicCheck(key: string): void {
    if (this.intervalIds.has(key)) return;

    const intervalId = window.setInterval(async () => {
      await this.checkForCloudUpdates(key);
    }, this.syncInterval);

    this.intervalIds.set(key, intervalId);
  }

  private stopPeriodicCheck(key: string): void {
    const intervalId = this.intervalIds.get(key);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervalIds.delete(key);
    }
  }

  private async checkForCloudUpdates(key: string): Promise<void> {
    try {
      const cloudData = await this.loadFromCloud(key);
      if (!cloudData) return;

      const localData = localStorage.getItem(key);
      let shouldUpdate = true;

      if (localData) {
        try {
          const local = JSON.parse(localData);
          // Comparer les timestamps pour éviter les conflits
          shouldUpdate = cloudData.lastModified > (local.lastModified || 0);
        } catch (error) {
          console.warn('Erreur comparaison données locales:', error);
        }
      }

      if (shouldUpdate) {
        // Sauvegarder localement
        localStorage.setItem(key, JSON.stringify(cloudData));
        
        // Notifier les listeners
        const listeners = this.listeners.get(key);
        if (listeners) {
          listeners.forEach(callback => {
            try {
              callback(cloudData);
            } catch (error) {
              console.warn('Erreur notification listener:', error);
            }
          });
        }

        console.log(`🔄 Mise à jour automatique depuis le cloud pour ${key}`);
      }
    } catch (error) {
      console.warn(`Erreur vérification cloud pour ${key}:`, error);
    }
  }

  private startAutoSync(): void {
    // Synchronisation initiale au chargement
    setTimeout(() => {
      Object.keys(CLOUD_CONFIG.binIds).forEach(key => {
        this.checkForCloudUpdates(key);
      });
    }, 2000); // Attendre 2 secondes après le chargement
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  // Méthode pour forcer la synchronisation de toutes les progressions
  async syncAll(): Promise<{ success: string[], failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] };
    
    for (const key of Object.keys(CLOUD_CONFIG.binIds)) {
      try {
        const localData = localStorage.getItem(key);
        if (localData) {
          const data = JSON.parse(localData);
          const success = await this.saveToCloud(key, data);
          if (success) {
            results.success.push(key);
          } else {
            results.failed.push(key);
          }
        }
      } catch (error) {
        console.warn(`Erreur sync ${key}:`, error);
        results.failed.push(key);
      }
    }
    
    return results;
  }

  // Méthode pour télécharger toutes les données du cloud
  async downloadAll(): Promise<{ success: string[], failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] };
    
    for (const key of Object.keys(CLOUD_CONFIG.binIds)) {
      try {
        const cloudData = await this.loadFromCloud(key);
        if (cloudData) {
          localStorage.setItem(key, JSON.stringify(cloudData));
          results.success.push(key);
          
          // Notifier les listeners
          const listeners = this.listeners.get(key);
          if (listeners) {
            listeners.forEach(callback => callback(cloudData));
          }
        } else {
          results.failed.push(key);
        }
      } catch (error) {
        console.warn(`Erreur download ${key}:`, error);
        results.failed.push(key);
      }
    }
    
    return results;
  }
}

// Instance singleton
export const cloudSyncManager = new CloudSyncService();

// Hook React pour utiliser la synchronisation cloud
import React from 'react';

export function useCloudSync<T>(key: string, initialValue: T): [T, (value: T) => void, boolean] {
  const [state, setState] = React.useState<T>(initialValue);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Charger les données initiales (local puis cloud)
    const loadInitialData = async () => {
      // D'abord charger les données locales
      const localData = localStorage.getItem(key);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          setState(parsed);
        } catch (error) {
          console.warn('Erreur parsing données locales:', error);
        }
      }

      // Puis vérifier le cloud
      const cloudData = await cloudSyncManager.loadFromCloud(key);
      if (cloudData) {
        const localTimestamp = localData ? JSON.parse(localData).lastModified || 0 : 0;
        if (cloudData.lastModified > localTimestamp) {
          setState(cloudData);
          localStorage.setItem(key, JSON.stringify(cloudData));
        }
      }

      setIsLoading(false);
    };

    loadInitialData();

    // S'abonner aux changements cloud
    const unsubscribe = cloudSyncManager.subscribeToCloudChanges(key, (data) => {
      setState(data);
    });

    return unsubscribe;
  }, [key]);

  const setCloudState = React.useCallback(async (value: T) => {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
    
    // Sauvegarder dans le cloud en arrière-plan
    cloudSyncManager.saveToCloud(key, value).catch(error => {
      console.warn('Erreur sauvegarde cloud:', error);
    });
  }, [key]);

  return [state, setCloudState, isLoading];
}

// Utilitaires pour l'interface
export function getConnectionStatus(): { isOnline: boolean; lastSync: string } {
  return {
    isOnline: cloudSyncManager.isOnline(),
    lastSync: new Date().toLocaleString()
  };
}