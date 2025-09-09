// Utilitaires pour l'export hors ligne de l'application
export interface OfflineExportData {
  version: string;
  exportDate: string;
  progressions: {
    progA1A2: any;
    progA2B1: any;
    progB1B2: any;
    progA2Emploi: any;
  };
  configs: any;
}

export function exportAllProgressions(): OfflineExportData {
  const exportData: OfflineExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    progressions: {
      progA1A2: getProgressionData('progA1A2'),
      progA2B1: getProgressionData('progA2B1'),
      progB1B2: getProgressionData('progB1B2'),
      progA2Emploi: getProgressionData('progA2Emploi')
    },
    configs: {
      // Inclure les configurations pour l'utilisation hors ligne
      a1a2: {
        title: 'Progression Annuelle A1→A2',
        subtitle: 'Français Langue Étrangère • Niveau A1 → A2',
        themes: [
          "SE PRÉSENTER", "LA FAMILLE", "LES NOMBRES", "L'HEURE ET LA DATE",
          "LES COULEURS", "LE CORPS HUMAIN", "LES VÊTEMENTS", "LA NOURRITURE",
          "LA MAISON", "LES TRANSPORTS", "LES LOISIRS", "LE TRAVAIL",
          "LA MÉTÉO", "LES ANIMAUX", "LA VILLE", "LES COURSES",
          "AU RESTAURANT", "À L'HÔTEL", "CHEZ LE MÉDECIN", "LES VACANCES",
          "LES FÊTES", "L'ÉCOLE", "LES SENTIMENTS", "LES DIRECTIONS",
          "LA NATURE", "LE SPORT", "LA MUSIQUE", "LES MÉDIAS",
          "L'INFORMATIQUE", "LES VOYAGES"
        ],
        grammarPoints: [
          "Articles définis et indéfinis (le, la, les, un, une, des)",
          "Présent de l'indicatif (verbes du 1er groupe)",
          "Présent de l'indicatif (verbes du 2ème groupe)",
          "Présent de l'indicatif (verbes du 3ème groupe)",
          "Verbes être et avoir",
          "Adjectifs qualificatifs (accord)",
          "Adjectifs possessifs (mon, ma, mes...)",
          "Adjectifs démonstratifs (ce, cette, ces)",
          "Négation simple (ne... pas)",
          "Interrogation (est-ce que, inversion)",
          "Prépositions de lieu (à, dans, sur, sous...)",
          "Prépositions de temps (à, de, depuis, pendant)",
          "Passé composé (auxiliaire avoir)",
          "Passé composé (auxiliaire être)",
          "Futur proche (aller + infinitif)",
          "Imparfait (formation et usage)",
          "Pronoms personnels sujets",
          "Pronoms personnels COD",
          "Pronoms personnels COI",
          "Comparatif (plus... que, moins... que)",
          "Superlatif (le plus, le moins)",
          "Impératif (formation et usage)",
          "Conditionnel de politesse",
          "Subjonctif présent (il faut que)",
          "Expression du temps (quand, pendant que)",
          "Expression de la cause (parce que, car)",
          "Expression du but (pour + infinitif)",
          "Pronoms relatifs simples (qui, que)",
          "Gérondif (en + participe présent)",
          "Accord du participe passé (cas simples)"
        ]
      }
      // Les autres configurations seront ajoutées automatiquement
    }
  };

  return exportData;
}

function getProgressionData(key: string): any {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function downloadOfflinePackage() {
  const exportData = exportAllProgressions();
  
  // Créer le fichier JSON avec toutes les données
  const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json' 
  });
  
  // Télécharger le fichier
  const url = URL.createObjectURL(jsonBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ispa-progressions-complete-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importOfflinePackage(data: OfflineExportData) {
  // Importer toutes les progressions
  Object.entries(data.progressions).forEach(([key, progression]) => {
    if (progression) {
      localStorage.setItem(key, JSON.stringify(progression));
    }
  });
  
  return true;
}