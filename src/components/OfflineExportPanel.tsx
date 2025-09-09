import React, { useRef } from 'react';
import { Download, Upload, Globe, HardDrive, FileText, Package, RefreshCw } from 'lucide-react';
import { downloadOfflinePackage, importOfflinePackage, OfflineExportData } from '../utils/offlineExport';
import { downloadAllProgressions, importAllProgressions } from '../utils/sharedState';

export default function OfflineExportPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const syncFileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleSyncImport = () => {
    syncFileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData: OfflineExportData = JSON.parse(e.target?.result as string);
        
        if (importedData.version && importedData.progressions) {
          importOfflinePackage(importedData);
          alert('✅ Toutes les progressions ont été importées avec succès !');
          window.location.reload(); // Recharger pour appliquer les changements
        } else {
          alert('❌ Format de fichier invalide.');
        }
      } catch (error) {
        alert('❌ Erreur lors de l\'importation du fichier.');
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSyncFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = importAllProgressions(jsonData);
        
        if (success) {
          alert('✅ Synchronisation réussie ! Toutes les progressions ont été mises à jour.');
          window.location.reload();
        } else {
          alert('❌ Erreur lors de la synchronisation. Vérifiez le format du fichier.');
        }
      } catch (error) {
        alert('❌ Fichier de synchronisation invalide.');
      }
    };
    reader.readAsText(file);
    
    if (syncFileInputRef.current) {
      syncFileInputRef.current.value = '';
    }
  };
  const downloadInstructions = () => {
    const instructions = `
# 📋 INSTRUCTIONS - Utilisation Hors Ligne ISPA Progressions

## 🎯 Objectif
Utiliser l'application ISPA Progressions sur un ordinateur sans connexion internet.

## 📦 Contenu du Package
- ✅ Toutes vos progressions (A1→A2, A2→B1, B1→B2, A2→Emploi)
- ✅ Toutes les étiquettes personnalisées
- ✅ Toute la configuration des thèmes et points grammaticaux
- ✅ Sauvegarde complète au format JSON

## 🚀 Installation Hors Ligne

### Étape 1 : Télécharger l'application
1. Rendez-vous sur : https://application-de-progr-moc2.bolt.host
2. Utilisez Ctrl+S (ou Cmd+S sur Mac) pour sauvegarder la page
3. Choisissez "Page web complète" dans le type de fichier
4. Sauvegardez dans un dossier dédié (ex: "ISPA-Progressions")

### Étape 2 : Importer vos données
1. Ouvrez le fichier HTML sauvegardé dans votre navigateur
2. Allez dans l'onglet "Accueil"
3. Utilisez le bouton "📦 Importer Package Complet"
4. Sélectionnez votre fichier JSON d'export

### Étape 3 : Utilisation
- ✅ Toutes vos progressions sont maintenant disponibles hors ligne
- ✅ Vous pouvez modifier, ajouter, supprimer des étiquettes
- ✅ Les exports Word/PDF fonctionnent normalement
- ✅ La sauvegarde se fait dans le navigateur local

## 🔄 Synchronisation
Pour synchroniser avec d'autres ordinateurs :
1. Exportez le package complet depuis l'ordinateur source
2. Importez le package sur l'ordinateur de destination

## 🔄 Synchronisation entre Appareils
Pour synchroniser entre différents ordinateurs/navigateurs :
1. Sur l'appareil source : "🔄 Export Synchronisation"
2. Transférez le fichier vers le nouvel appareil
3. Sur le nouvel appareil : "🔄 Import Synchronisation"
4. Vos progressions sont synchronisées !

## ⚠️ Important
- Les données sont sauvegardées dans le navigateur local
- Pensez à faire des exports réguliers pour éviter la perte de données
- L'application fonctionne avec tous les navigateurs modernes

## 📞 Support
Institut Supérieur de Propédeutique d'Amiens (ISPA)
Email : contact@amiens-ispa.fr
`;

    const blob = new Blob([instructions], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'INSTRUCTIONS-Utilisation-Hors-Ligne.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10 mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        💾 Utilisation Hors Ligne
      </h2>
      
      <div className="max-w-4xl mx-auto">
        <p className="text-lg text-gray-600 mb-8 text-center leading-relaxed">
          Exportez toutes vos progressions pour utiliser l'application sur un ordinateur 
          sans connexion internet. Parfait pour les salles de classe ou le travail à domicile.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Synchronisation entre appareils */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Synchronisation</h3>
            </div>
            <p className="text-gray-600 mb-4">
              <strong>Nouveau !</strong> Synchronisez vos progressions entre différents 
              ordinateurs ou navigateurs facilement.
            </p>
            <div className="space-y-3">
              <button
                onClick={downloadAllProgressions}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
              >
                <Download className="w-5 h-5" />
                🔄 Export Synchronisation
              </button>
              <button
                onClick={handleSyncImport}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
              >
                <Upload className="w-5 h-5" />
                🔄 Import Synchronisation
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Export Complet</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Téléchargez toutes vos progressions en un seul fichier JSON. 
              Inclut toutes les étiquettes personnalisées et configurations.
            </p>
            <button
              onClick={downloadOfflinePackage}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Download className="w-5 h-5" />
              Télécharger Package Complet
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-8 h-8 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">Import Complet</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Importez un package complet pour restaurer toutes vos progressions 
              sur un nouvel ordinateur ou après une réinstallation.
            </p>
            <button
              onClick={handleImport}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Upload className="w-5 h-5" />
              Importer Package Complet
            </button>
          </div>
          
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">Instructions Détaillées</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Téléchargez le guide complet pour installer et utiliser l'application 
            hors ligne sur n'importe quel ordinateur.
          </p>
          <button
            onClick={downloadInstructions}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <FileText className="w-5 h-5" />
            Télécharger Instructions
          </button>
        </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            🔄 Synchronisation Simplifiée
          </h4>
          <p className="text-gray-600 mb-3">
            <strong>Problème résolu !</strong> Plus besoin de réimporter les JSON à chaque changement d'ordinateur :
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>Sur l'ordinateur principal :</strong> Cliquez "🔄 Export Synchronisation"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>Transférez le fichier</strong> vers le nouvel ordinateur (clé USB, email, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>Sur le nouvel ordinateur :</strong> Cliquez "🔄 Import Synchronisation"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>C'est tout !</strong> Toutes vos progressions sont synchronisées instantanément</span>
            </li>
          </ul>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileImport}
        className="hidden"
      />
      <input
        ref={syncFileInputRef}
        type="file"
        accept="application/json"
        onChange={handleSyncFileImport}
        className="hidden"
      />
    </section>
  );
}