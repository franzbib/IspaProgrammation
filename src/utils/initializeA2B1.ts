// Initialisation des données pour la progression A2→B1
export function initializeA2B1Progression() {
  const progressionData = {
    version: 3,
    rows: [
      { label: '01', type: 'week' },
      { label: '02', type: 'week' },
      { label: '03', type: 'week' },
      { label: '04', type: 'week' },
      { label: '05', type: 'week' },
      { label: '06', type: 'week' },
      { label: '07', type: 'week' },
      { label: 'Vacances', type: 'vac' },
      { label: '08', type: 'week' },
      { label: '09', type: 'week' },
      { label: '10', type: 'week' },
      { label: '11', type: 'week' },
      { label: '12', type: 'week' },
      { label: '13', type: 'week' },
      { label: '14', type: 'week' },
      { label: 'Vacances', type: 'vac' },
      { label: '15', type: 'week' },
      { label: '16', type: 'week' },
      { label: '17', type: 'week' },
      { label: '18', type: 'week' },
      { label: '19', type: 'week' },
      { label: '20', type: 'week' },
      { label: '21', type: 'week' },
      { label: 'Vacances', type: 'vac' },
      { label: '22', type: 'week' },
      { label: '23', type: 'week' },
      { label: '24', type: 'week' },
      { label: '25', type: 'week' },
      { label: '26', type: 'week' },
      { label: '27', type: 'week' },
      { label: '28', type: 'week' },
      { label: 'Vacances', type: 'vac' },
      { label: '29', type: 'week' },
      { label: '30', type: 'week' }
    ],
    cells: {
      // Semaine 1 - Les loisirs
      'r1c1': ['theme-0'],
      'r1c2': ['chip-0', 'chip-1', 'chip-2'],
      
      // Semaine 2 - La gastronomie
      'r2c1': ['theme-1'],
      'r2c2': ['chip-3', 'chip-4', 'chip-5'],
      
      // Semaine 3 - La littérature
      'r3c1': ['theme-2'],
      'r3c2': ['chip-6', 'chip-7', 'chip-8'],
      
      // Semaine 4 - Les études supérieures
      'r4c1': ['theme-3'],
      'r4c2': ['chip-9', 'chip-10', 'chip-11'],
      
      // Semaine 5 - Réussir sa candidature
      'r5c1': ['theme-4'],
      'r5c2': ['chip-12', 'chip-13', 'chip-14'],
      
      // Semaine 6 - Le cinéma
      'r6c1': ['theme-5'],
      'r6c2': ['chip-15', 'chip-16', 'chip-17'],
      
      // Semaine 7 - Le sport
      'r7c1': ['theme-6'],
      'r7c2': ['chip-18', 'chip-19', 'chip-20'],
      
      // Semaine 8 - La santé (après vacances)
      'r9c1': ['theme-7'],
      'r9c2': ['chip-21', 'chip-22', 'chip-23'],
      
      // Semaine 9 - Les médecines alternatives
      'r10c1': ['theme-8'],
      'r10c2': ['chip-24', 'chip-25', 'chip-26'],
      
      // Semaine 10 - Le commerce et l'économie
      'r11c1': ['theme-9'],
      'r11c2': ['chip-27', 'chip-28', 'chip-29'],
      
      // Semaine 11 - Le tourisme
      'r12c1': ['theme-10'],
      'r12c2': ['chip-30', 'chip-31', 'chip-32'],
      
      // Semaine 12 - Le logement
      'r13c1': ['theme-11'],
      'r13c2': ['chip-33', 'chip-34', 'chip-35'],
      
      // Semaine 13 - L'écologie
      'r14c1': ['theme-12'],
      'r14c2': ['chip-36', 'chip-37', 'chip-38'],
      
      // Semaine 14 - Les transports propres (après vacances)
      'r16c1': ['theme-13'],
      'r16c2': ['chip-39', 'chip-40', 'chip-41'],
      
      // Semaine 15 - La vie associative
      'r17c1': ['theme-14'],
      'r17c2': ['chip-42', 'chip-43', 'chip-44'],
      
      // Semaine 16 - Liberté, Égalité, Fraternité
      'r18c1': ['theme-15'],
      'r18c2': ['chip-45', 'chip-46', 'chip-47'],
      
      // Semaine 17 - La parité
      'r19c1': ['theme-16'],
      'r19c2': ['chip-48', 'chip-49'],
      
      // Semaine 18 - Les grands repères historiques
      'r20c1': ['theme-17'],
      'r20c2': ['chip-50', 'chip-51'],
      
      // Semaine 19 - Le système politique
      'r21c1': ['theme-18'],
      'r21c2': ['chip-52', 'chip-53'],
      
      // Semaine 20 - Le monde numérique (après vacances)
      'r25c1': ['theme-19'],
      'r25c2': ['chip-54', 'chip-55'],
      
      // Semaine 21 - Les médias
      'r26c1': ['theme-20'],
      'r26c2': ['chip-56', 'chip-57'],
      
      // Semaine 22 - L'analyse d'une œuvre d'art
      'r27c1': ['theme-21'],
      'r27c2': ['chip-58', 'chip-59'],
      
      // Semaine 23 - La météo et le changement climatique
      'r28c1': ['theme-22'],
      'r28c2': ['chip-60', 'chip-61'],
      
      // Semaine 24 - Le monde professionnel (après vacances)
      'r30c1': ['theme-23'],
      'r30c2': ['chip-62', 'chip-63'],
      
      // Semaine 25 - Les clichés
      'r33c1': ['theme-24'],
      'r33c2': ['chip-64', 'chip-65'],
      
      // Semaine 26 - L'enquête
      'r34c1': ['theme-25'],
      'r34c2': ['chip-66', 'chip-67'],
      
      // Semaine 27 - La musique
      'r35c1': ['theme-26'],
      'r35c2': ['chip-68', 'chip-69'],
      
      // Semaine 28 - Le système scolaire
      'r36c1': ['theme-27'],
      'r36c2': ['chip-70', 'chip-71'],
      
      // Semaine 29 - La mode
      'r37c1': ['theme-28'],
      'r37c2': ['chip-72', 'chip-73'],
      
      // Semaine 30 - L'accès à la culture
      'r38c1': ['theme-29'],
      'r38c2': ['chip-74', 'chip-75']
    },
    bank: [],
    custom: {},
    lastModified: Date.now()
  };

  // Sauvegarder dans localStorage
  localStorage.setItem('progA2B1', JSON.stringify(progressionData));
  
  return progressionData;
}