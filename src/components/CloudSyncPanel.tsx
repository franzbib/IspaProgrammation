import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cloudSyncManager } from '../utils/cloudSync';

export default function CloudSyncPanel() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSyncAll = async () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    setSyncStatus('syncing');
    
    try {
      const results = await cloudSyncManager.syncAll();
      
      if (results.failed.length === 0) {
        setSyncStatus('success');
        setLastSync(new Date().toLocaleString());
      } else {
        setSyncStatus('error');
      }
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    setSyncStatus('syncing');
    
    try {
      const results = await cloudSyncManager.downloadAll();
      
      if (results.failed.length === 0) {
        setSyncStatus('success');
        setLastSync(new Date().toLocaleString());
        // Recharger la page pour appliquer les changements
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setSyncStatus('error');
      }
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <section className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10 mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        ☁️ Synchronisation Cloud Automatique
      </h2>
      
      <div className="max-w-4xl mx-auto">
        {/* Status Bar */}
        <div className={`p-4 rounded-2xl border-2 mb-6 ${
          isOnline 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
            : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <>
                  <Wifi className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-800">Connexion Active</h3>
                    <p className="text-sm text-green-600">
                      Synchronisation automatique toutes les 30 secondes
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <WifiOff className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-bold text-red-800">Hors Ligne</h3>
                    <p className="text-sm text-red-600">
                      Les modifications seront synchronisées à la reconnexion
                    </p>
                  </div>
                </>
              )}
            </div>
            
            {syncStatus === 'syncing' && (
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="font-semibold">Synchronisation...</span>
              </div>
            )}
            
            {syncStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Synchronisé !</span>
              </div>
            )}
            
            {syncStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Erreur</span>
              </div>
            )}
          </div>
          
          {lastSync && (
            <p className="text-xs text-gray-500 mt-2">
              Dernière synchronisation : {lastSync}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 leading-relaxed">
            <strong>🎉 Nouveau !</strong> Vos progressions sont maintenant <strong>automatiquement synchronisées</strong> 
            entre tous les ordinateurs et navigateurs. Plus besoin d'exporter/importer manuellement !
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <Cloud className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Synchronisation Automatique</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Sauvegarde automatique dans le cloud</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Synchronisation toutes les 30 secondes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Accessible depuis n'importe quel appareil</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Pas de perte de données</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Avantages</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Travail collaboratif en temps réel</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Toujours la dernière version</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Fonctionne sur mobile et tablette</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Sauvegarde locale + cloud</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Manual Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleSyncAll}
            disabled={!isOnline || isSyncing}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold"
          >
            {isSyncing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Cloud className="w-5 h-5" />
            )}
            Forcer la Synchronisation
          </button>
          
          <button
            onClick={handleDownloadAll}
            disabled={!isOnline || isSyncing}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold"
          >
            {isSyncing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            Télécharger Dernière Version
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            Comment ça marche ?
          </h4>
          <ul className="space-y-2 text-gray-600">
            <li><strong>1.</strong> Vos modifications sont automatiquement sauvegardées dans le cloud</li>
            <li><strong>2.</strong> Tous les utilisateurs reçoivent les mises à jour en temps réel</li>
            <li><strong>3.</strong> En cas de conflit, la version la plus récente est conservée</li>
            <li><strong>4.</strong> Fonctionne même hors ligne (synchronisation à la reconnexion)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}