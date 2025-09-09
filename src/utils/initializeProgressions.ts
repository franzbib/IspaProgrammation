// Utilitaire pour initialiser toutes les progressions avec des données cohérentes
export function initializeAllProgressions() {
  console.log('🔄 Initialisation de toutes les progressions...');
  
  // Initialiser A1→A2
  initializeA1A2();
  
  // Initialiser A2→B1
  initializeA2B1();
  
  // Initialiser B1→B2
  initializeB1B2();
  
  // Initialiser A2→Emploi
  initializeA2Emploi();
  
  console.log('✅ Toutes les progressions initialisées');
}

function initializeA1A2() {
  const progressionData = {
    version: 3,
    rows: [
      { label: '01', type: 'week' }, { label: '02', type: 'week' }, { label: '03', type: 'week' },
      { label: '04', type: 'week' }, { label: '05', type: 'week' }, { label: '06', type: 'week' },
      { label: '07', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '08', type: 'week' }, { label: '09', type: 'week' }, { label: '10', type: 'week' },
      { label: '11', type: 'week' }, { label: '12', type: 'week' }, { label: '13', type: 'week' },
      { label: '14', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '15', type: 'week' }, { label: '16', type: 'week' }, { label: '17', type: 'week' },
      { label: '18', type: 'week' }, { label: '19', type: 'week' }, { label: '20', type: 'week' },
      { label: '21', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '22', type: 'week' }, { label: '23', type: 'week' }, { label: '24', type: 'week' },
      { label: '25', type: 'week' }, { label: '26', type: 'week' }, { label: '27', type: 'week' },
      { label: '28', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '29', type: 'week' }, { label: '30', type: 'week' }
    ],
    cells: {
      'r1c1': ['theme-0'], 'r1c2': ['chip-0', 'chip-1', 'chip-2'],
      'r2c1': ['theme-1'], 'r2c2': ['chip-3', 'chip-4', 'chip-5'],
      'r3c1': ['theme-2'], 'r3c2': ['chip-6', 'chip-7', 'chip-8'],
      'r4c1': ['theme-3'], 'r4c2': ['chip-9', 'chip-10', 'chip-11'],
      'r5c1': ['theme-4'], 'r5c2': ['chip-12', 'chip-13', 'chip-14'],
      'r6c1': ['theme-5'], 'r6c2': ['chip-15', 'chip-16', 'chip-17'],
      'r7c1': ['theme-6'], 'r7c2': ['chip-18', 'chip-19', 'chip-20'],
      'r9c1': ['theme-7'], 'r9c2': ['chip-21', 'chip-22', 'chip-23'],
      'r10c1': ['theme-8'], 'r10c2': ['chip-24', 'chip-25', 'chip-26'],
      'r11c1': ['theme-9'], 'r11c2': ['chip-27', 'chip-28', 'chip-29'],
      'r12c1': ['theme-10'], 'r12c2': ['chip-30', 'chip-31', 'chip-32'],
      'r13c1': ['theme-11'], 'r13c2': ['chip-33', 'chip-34', 'chip-35'],
      'r14c1': ['theme-12'], 'r14c2': ['chip-36', 'chip-37', 'chip-38'],
      'r16c1': ['theme-13'], 'r16c2': ['chip-39', 'chip-40', 'chip-41'],
      'r17c1': ['theme-14'], 'r17c2': ['chip-42', 'chip-43', 'chip-44'],
      'r18c1': ['theme-15'], 'r18c2': ['chip-45', 'chip-46', 'chip-47'],
      'r19c1': ['theme-16'], 'r19c2': ['chip-48', 'chip-49'],
      'r20c1': ['theme-17'], 'r20c2': ['chip-50', 'chip-51'],
      'r21c1': ['theme-18'], 'r21c2': ['chip-52', 'chip-53'],
      'r25c1': ['theme-19'], 'r25c2': ['chip-54', 'chip-55'],
      'r26c1': ['theme-20'], 'r26c2': ['chip-56', 'chip-57'],
      'r27c1': ['theme-21'], 'r27c2': ['chip-58', 'chip-59'],
      'r28c1': ['theme-22'], 'r28c2': ['chip-60', 'chip-61'],
      'r30c1': ['theme-23'], 'r30c2': ['chip-62', 'chip-63'],
      'r33c1': ['theme-24'], 'r33c2': ['chip-64', 'chip-65'],
      'r34c1': ['theme-25'], 'r34c2': ['chip-66', 'chip-67'],
      'r35c1': ['theme-26'], 'r35c2': ['chip-68', 'chip-69'],
      'r36c1': ['theme-27'], 'r36c2': ['chip-70', 'chip-71'],
      'r37c1': ['theme-28'], 'r37c2': ['chip-72', 'chip-73'],
      'r38c1': ['theme-29'], 'r38c2': ['chip-74', 'chip-75']
    },
    bank: [],
    custom: {},
    lastModified: Date.now(),
    deviceId: getDeviceId()
  };
  
  localStorage.setItem('progA1A2', JSON.stringify(progressionData));
  console.log('✅ A1→A2 initialisé');
}

function initializeA2B1() {
  const progressionData = {
    version: 3,
    rows: [
      { label: '01', type: 'week' }, { label: '02', type: 'week' }, { label: '03', type: 'week' },
      { label: '04', type: 'week' }, { label: '05', type: 'week' }, { label: '06', type: 'week' },
      { label: '07', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '08', type: 'week' }, { label: '09', type: 'week' }, { label: '10', type: 'week' },
      { label: '11', type: 'week' }, { label: '12', type: 'week' }, { label: '13', type: 'week' },
      { label: '14', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '15', type: 'week' }, { label: '16', type: 'week' }, { label: '17', type: 'week' },
      { label: '18', type: 'week' }, { label: '19', type: 'week' }, { label: '20', type: 'week' },
      { label: '21', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '22', type: 'week' }, { label: '23', type: 'week' }, { label: '24', type: 'week' },
      { label: '25', type: 'week' }, { label: '26', type: 'week' }, { label: '27', type: 'week' },
      { label: '28', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '29', type: 'week' }, { label: '30', type: 'week' }
    ],
    cells: {
      'r1c1': ['theme-0'], 'r1c2': ['chip-0', 'chip-1', 'chip-2'],
      'r2c1': ['theme-1'], 'r2c2': ['chip-3', 'chip-4', 'chip-5'],
      'r3c1': ['theme-2'], 'r3c2': ['chip-6', 'chip-7', 'chip-8'],
      'r4c1': ['theme-3'], 'r4c2': ['chip-9', 'chip-10', 'chip-11'],
      'r5c1': ['theme-4'], 'r5c2': ['chip-12', 'chip-13', 'chip-14'],
      'r6c1': ['theme-5'], 'r6c2': ['chip-15', 'chip-16', 'chip-17'],
      'r7c1': ['theme-6'], 'r7c2': ['chip-18', 'chip-19', 'chip-20'],
      'r9c1': ['theme-7'], 'r9c2': ['chip-21', 'chip-22', 'chip-23'],
      'r10c1': ['theme-8'], 'r10c2': ['chip-24', 'chip-25', 'chip-26'],
      'r11c1': ['theme-9'], 'r11c2': ['chip-27', 'chip-28', 'chip-29'],
      'r12c1': ['theme-10'], 'r12c2': ['chip-30', 'chip-31', 'chip-32'],
      'r13c1': ['theme-11'], 'r13c2': ['chip-33', 'chip-34', 'chip-35'],
      'r14c1': ['theme-12'], 'r14c2': ['chip-36', 'chip-37', 'chip-38'],
      'r16c1': ['theme-13'], 'r16c2': ['chip-39', 'chip-40', 'chip-41'],
      'r17c1': ['theme-14'], 'r17c2': ['chip-42', 'chip-43', 'chip-44'],
      'r18c1': ['theme-15'], 'r18c2': ['chip-45', 'chip-46', 'chip-47'],
      'r19c1': ['theme-16'], 'r19c2': ['chip-48', 'chip-49', 'chip-50'],
      'r20c1': ['theme-17'], 'r20c2': ['chip-51', 'chip-52', 'chip-53'],
      'r21c1': ['theme-18'], 'r21c2': ['chip-54', 'chip-55', 'chip-56'],
      'r25c1': ['theme-19'], 'r25c2': ['chip-57', 'chip-58', 'chip-59'],
      'r26c1': ['theme-20'], 'r26c2': ['chip-60', 'chip-61', 'chip-62'],
      'r27c1': ['theme-21'], 'r27c2': ['chip-63', 'chip-64', 'chip-65'],
      'r28c1': ['theme-22'], 'r28c2': ['chip-66', 'chip-67', 'chip-68'],
      'r33c1': ['theme-23'], 'r33c2': ['chip-69', 'chip-70', 'chip-71'],
      'r34c1': ['theme-24'], 'r34c2': ['chip-72', 'chip-73', 'chip-74'],
      'r35c1': ['theme-25'], 'r35c2': ['chip-75', 'chip-76', 'chip-77'],
      'r36c1': ['theme-26'], 'r36c2': ['chip-78', 'chip-79', 'chip-80'],
      'r37c1': ['theme-27'], 'r37c2': ['chip-81', 'chip-82', 'chip-83'],
      'r38c1': ['theme-28'], 'r38c2': ['chip-84', 'chip-85', 'chip-86'],
      'r39c1': ['theme-29'], 'r39c2': ['chip-87', 'chip-88', 'chip-89']
    },
    bank: [],
    custom: {},
    lastModified: Date.now(),
    deviceId: getDeviceId()
  };
  
  localStorage.setItem('progA2B1', JSON.stringify(progressionData));
  console.log('✅ A2→B1 initialisé');
}

function initializeB1B2() {
  const progressionData = {
    version: 3,
    rows: [
      { label: '01', type: 'week' }, { label: '02', type: 'week' }, { label: '03', type: 'week' },
      { label: '04', type: 'week' }, { label: '05', type: 'week' }, { label: '06', type: 'week' },
      { label: '07', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '08', type: 'week' }, { label: '09', type: 'week' }, { label: '10', type: 'week' },
      { label: '11', type: 'week' }, { label: '12', type: 'week' }, { label: '13', type: 'week' },
      { label: '14', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '15', type: 'week' }, { label: '16', type: 'week' }, { label: '17', type: 'week' },
      { label: '18', type: 'week' }, { label: '19', type: 'week' }, { label: '20', type: 'week' },
      { label: '21', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '22', type: 'week' }, { label: '23', type: 'week' }, { label: '24', type: 'week' },
      { label: '25', type: 'week' }, { label: '26', type: 'week' }, { label: '27', type: 'week' },
      { label: '28', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '29', type: 'week' }, { label: '30', type: 'week' }
    ],
    cells: {
      'r1c1': ['theme-0'], 'r1c2': ['chip-0', 'chip-1', 'chip-2'],
      'r2c1': ['theme-1'], 'r2c2': ['chip-3', 'chip-4', 'chip-5'],
      'r3c1': ['theme-2'], 'r3c2': ['chip-6', 'chip-7', 'chip-8'],
      'r4c1': ['theme-3'], 'r4c2': ['chip-9', 'chip-10', 'chip-11'],
      'r5c1': ['theme-4'], 'r5c2': ['chip-12', 'chip-13', 'chip-14'],
      'r6c1': ['theme-5'], 'r6c2': ['chip-15', 'chip-16', 'chip-17'],
      'r7c1': ['theme-6'], 'r7c2': ['chip-18', 'chip-19', 'chip-20'],
      'r9c1': ['theme-7'], 'r9c2': ['chip-21', 'chip-22', 'chip-23'],
      'r10c1': ['theme-8'], 'r10c2': ['chip-24', 'chip-25', 'chip-26'],
      'r11c1': ['theme-9'], 'r11c2': ['chip-27', 'chip-28', 'chip-29'],
      'r12c1': ['theme-10'], 'r12c2': ['chip-30', 'chip-31', 'chip-32'],
      'r13c1': ['theme-11'], 'r13c2': ['chip-33', 'chip-34', 'chip-35'],
      'r14c1': ['theme-12'], 'r14c2': ['chip-36', 'chip-37', 'chip-38'],
      'r16c1': ['theme-13'], 'r16c2': ['chip-39', 'chip-40', 'chip-41'],
      'r17c1': ['theme-14'], 'r17c2': ['chip-42', 'chip-43', 'chip-44'],
      'r18c1': ['theme-15'], 'r18c2': ['chip-45', 'chip-46', 'chip-47'],
      'r19c1': ['theme-16'], 'r19c2': ['chip-48', 'chip-49'],
      'r20c1': ['theme-17'], 'r20c2': ['chip-50', 'chip-51'],
      'r21c1': ['theme-18'], 'r21c2': ['chip-52', 'chip-53'],
      'r25c1': ['theme-19'], 'r25c2': ['chip-54', 'chip-55'],
      'r26c1': ['theme-20'], 'r26c2': ['chip-56', 'chip-57'],
      'r27c1': ['theme-21'], 'r27c2': ['chip-58', 'chip-59'],
      'r28c1': ['theme-22'], 'r28c2': ['chip-60', 'chip-61'],
      'r30c1': ['theme-23'], 'r30c2': ['chip-62', 'chip-63'],
      'r33c1': ['theme-24'], 'r33c2': ['chip-64', 'chip-65'],
      'r34c1': ['theme-25'], 'r34c2': ['chip-66', 'chip-67'],
      'r35c1': ['theme-26'], 'r35c2': ['chip-68', 'chip-69'],
      'r36c1': ['theme-27'], 'r36c2': ['chip-70', 'chip-71'],
      'r37c1': ['theme-28'], 'r37c2': ['chip-72', 'chip-73'],
      'r38c1': ['theme-29'], 'r38c2': ['chip-74', 'chip-75']
    },
    bank: [],
    custom: {},
    lastModified: Date.now(),
    deviceId: getDeviceId()
  };
  
  localStorage.setItem('progB1B2', JSON.stringify(progressionData));
  console.log('✅ B1→B2 initialisé');
}

function initializeA2Emploi() {
  const progressionData = {
    version: 3,
    rows: [
      { label: '01', type: 'week' }, { label: '02', type: 'week' }, { label: '03', type: 'week' },
      { label: '04', type: 'week' }, { label: '05', type: 'week' }, { label: '06', type: 'week' },
      { label: '07', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '08', type: 'week' }, { label: '09', type: 'week' }, { label: '10', type: 'week' },
      { label: '11', type: 'week' }, { label: '12', type: 'week' }, { label: '13', type: 'week' },
      { label: '14', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '15', type: 'week' }, { label: '16', type: 'week' }, { label: '17', type: 'week' },
      { label: '18', type: 'week' }, { label: '19', type: 'week' }, { label: '20', type: 'week' },
      { label: '21', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '22', type: 'week' }, { label: '23', type: 'week' }, { label: '24', type: 'week' },
      { label: '25', type: 'week' }, { label: '26', type: 'week' }, { label: '27', type: 'week' },
      { label: '28', type: 'week' }, { label: 'Vacances', type: 'vac' },
      { label: '29', type: 'week' }, { label: '30', type: 'week' }
    ],
    cells: {
      'r1c1': ['theme-0'], 'r1c2': ['chip-0', 'chip-1', 'chip-2'],
      'r2c1': ['theme-1'], 'r2c2': ['chip-3', 'chip-4', 'chip-5'],
      'r3c1': ['theme-2'], 'r3c2': ['chip-6', 'chip-7', 'chip-8'],
      'r4c1': ['theme-3'], 'r4c2': ['chip-9', 'chip-10', 'chip-11'],
      'r5c1': ['theme-4'], 'r5c2': ['chip-12', 'chip-13', 'chip-14'],
      'r6c1': ['theme-5'], 'r6c2': ['chip-15', 'chip-16', 'chip-17'],
      'r7c1': ['theme-6'], 'r7c2': ['chip-18', 'chip-19', 'chip-20'],
      'r9c1': ['theme-7'], 'r9c2': ['chip-21', 'chip-22', 'chip-23'],
      'r10c1': ['theme-8'], 'r10c2': ['chip-24', 'chip-25', 'chip-26'],
      'r11c1': ['theme-9'], 'r11c2': ['chip-27', 'chip-28', 'chip-29'],
      'r12c1': ['theme-10'], 'r12c2': ['chip-30', 'chip-31', 'chip-32'],
      'r13c1': ['theme-11'], 'r13c2': ['chip-33', 'chip-34', 'chip-35'],
      'r14c1': ['theme-12'], 'r14c2': ['chip-36', 'chip-37', 'chip-38'],
      'r16c1': ['theme-13'], 'r16c2': ['chip-39', 'chip-40', 'chip-41'],
      'r17c1': ['theme-14'], 'r17c2': ['chip-42', 'chip-43', 'chip-44'],
      'r18c1': ['theme-15'], 'r18c2': ['chip-45', 'chip-46', 'chip-47'],
      'r19c1': ['theme-16'], 'r19c2': ['chip-48', 'chip-49'],
      'r20c1': ['theme-17'], 'r20c2': ['chip-50', 'chip-51'],
      'r21c1': ['theme-18'], 'r21c2': ['chip-52', 'chip-53'],
      'r25c1': ['theme-19'], 'r25c2': ['chip-54', 'chip-55'],
      'r26c1': ['theme-20'], 'r26c2': ['chip-56', 'chip-57'],
      'r27c1': ['theme-21'], 'r27c2': ['chip-58', 'chip-59'],
      'r28c1': ['theme-22'], 'r28c2': ['chip-60', 'chip-61'],
      'r30c1': ['theme-23'], 'r30c2': ['chip-62', 'chip-63'],
      'r33c1': ['theme-24'], 'r33c2': ['chip-64', 'chip-65'],
      'r34c1': ['theme-25'], 'r34c2': ['chip-66', 'chip-67'],
      'r35c1': ['theme-26'], 'r35c2': ['chip-68', 'chip-69'],
      'r36c1': ['theme-27'], 'r36c2': ['chip-70', 'chip-71'],
      'r37c1': ['theme-28'], 'r37c2': ['chip-72', 'chip-73'],
      'r38c1': ['theme-29'], 'r38c2': ['chip-74', 'chip-75']
    },
    bank: [],
    custom: {},
    lastModified: Date.now(),
    deviceId: getDeviceId()
  };
  
  localStorage.setItem('progA2Emploi', JSON.stringify(progressionData));
  console.log('✅ A2→Emploi initialisé');
}

function getDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}