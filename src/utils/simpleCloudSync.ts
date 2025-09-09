// Système de synchronisation simple et fiable
export interface SimpleCloudData {
  version: number;
  timestamp: number;
  data: any;
  deviceId: string;
}

// Utilisation d'un service simple et gratuit pour le stockage
const STORAGE_ENDPOINT = 'https://api.jsonbin.io/v3/b/67560a1be41b4d34e4f8c789';
const API_KEY = '$2a$10$8K8vQ2QZxJ.Hn8vQ2QZxJ.Hn8vQ2QZxJ.Hn8vQ2QZxJ.Hn8vQ2QZxJ';

class SimpleCloudSync {
  private isOnline(): boolean {
    return navigator.onLine;
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  async saveToCloud(key: string, data: any): Promise<boolean> {
    if (!this.isOnline()) return false;

    try {
      const cloudData: SimpleCloudData = {
        version: (data.version || 0) + 1,
        timestamp: Date.now(),
        data: data,
        deviceId: this.getDeviceId()
      };

      const response = await fetch(`${STORAGE_ENDPOINT}/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify(cloudData)
      });

      return response.ok;
    } catch (error) {
      console.warn('Erreur sauvegarde cloud:', error);
      return false;
    }
  }

  async loadFromCloud(key: string): Promise<any> {
    if (!this.isOnline()) return null;

    try {
      const response = await fetch(`${STORAGE_ENDPOINT}/${key}/latest`, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });

      if (response.ok) {
        const result = await response.json();
        return result.record?.data || null;
      }
    } catch (error) {
      console.warn('Erreur chargement cloud:', error);
    }

    return null;
  }

  async getCloudTimestamp(key: string): Promise<number> {
    if (!this.isOnline()) return 0;

    try {
      const response = await fetch(`${STORAGE_ENDPOINT}/${key}/latest`, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });

      if (response.ok) {
        const result = await response.json();
        return result.record?.timestamp || 0;
      }
    } catch (error) {
      console.warn('Erreur timestamp cloud:', error);
    }

    return 0;
  }
}

export const simpleCloudSync = new SimpleCloudSync();