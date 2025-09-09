import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Calendar, FileDown, FileUp, FileText, Printer, RotateCcw, Trash2 } from 'lucide-react';
import { sharedStateManager } from '../utils/sharedState';

interface Row {
  label: string;
  type: 'week' | 'vac';
}

interface AppState {
  version: number;
  rows: Row[];
  cells: Record<string, string[]>;
  bank: string[];
  custom: Record<string, string>;
}

export interface ProgressionConfig {
  title: string;
  subtitle: string;
  storageKey: string;
  themes: string[];
  grammarPoints: string[];
  customLabels: Record<string, string>;
}

interface ProgressionAppProps {
  config: ProgressionConfig;
  isReadOnly?: boolean;
}

export default function ProgressionApp({ config, isReadOnly = false }: ProgressionAppProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [cells, setCells] = useState<Record<string, string[]>>({});
  const [bankChips, setBankChips] = useState<string[]>([]);
  const [customChips, setCustomChips] = useState<Record<string, string>>({});
  const [draggedChip, setDraggedChip] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with 50 empty rows
  useEffect(() => {
    const savedState = localStorage.getItem(config.storageKey);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        restoreState(state);
      } catch {
        if (config.storageKey === 'progA2B1') {
          initializeA2B1WithData();
        } else {
          initializeDefault();
        }
      }
    } else {
      // Pour A2→B1, initialiser avec les données pré-remplies
      if (config.storageKey === 'progA2B1') {
        initializeA2B1WithData();
      } else {
        initializeDefault();
      }
    }
  }, [config.storageKey]);

  const initializeA2B1WithData = () => {
    // Créer 30 semaines + 4 périodes de vacances
    const newRows: Row[] = [
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
    ];
    
    // Créer les cellules avec thèmes et grammaire
    const newCells: Record<string, string[]> = {
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
      'r19c2': ['chip-48', 'chip-49', 'chip-50'],
      
      // Semaine 18 - Les grands repères historiques
      'r20c1': ['theme-17'],
      'r20c2': ['chip-51', 'chip-52', 'chip-53'],
      
      // Semaine 19 - Le système politique
      'r21c1': ['theme-18'],
      'r21c2': ['chip-54', 'chip-55', 'chip-56'],
      
      // Semaine 20 - Le monde numérique (après vacances)
      'r24c1': ['theme-19'],
      'r24c2': ['chip-57', 'chip-58', 'chip-59'],
      
      // Semaine 21 - Les médias
      'r25c1': ['theme-20'],
      'r25c2': ['chip-60', 'chip-61', 'chip-62'],
      
      // Semaine 22 - L'analyse d'une œuvre d'art
      'r26c1': ['theme-21'],
      'r26c2': ['chip-63', 'chip-64', 'chip-65'],
      
      // Semaine 23 - La météo et le changement climatique
      'r27c1': ['theme-22'],
      'r27c2': ['chip-66', 'chip-67', 'chip-68'],
      
      // Semaine 24 - Le monde professionnel (après vacances)
      'r32c1': ['theme-23'],
      'r32c2': ['chip-69', 'chip-70', 'chip-71'],
      
      // Semaine 25 - Les clichés
      'r33c1': ['theme-24'],
      'r33c2': ['chip-72', 'chip-73', 'chip-74'],
      
      // Semaine 26 - L'enquête
      'r34c1': ['theme-25'],
      'r34c2': ['chip-75', 'chip-76', 'chip-77'],
      
      // Semaine 27 - La musique
      'r35c1': ['theme-26'],
      'r35c2': ['chip-78', 'chip-79', 'chip-80'],
      
      // Semaine 28 - Le système scolaire
      'r36c1': ['theme-27'],
      'r36c2': ['chip-81', 'chip-82', 'chip-83'],
      
      // Semaine 29 - La mode
      'r37c1': ['theme-28'],
      'r37c2': ['chip-84', 'chip-85', 'chip-86'],
      
      // Semaine 30 - L'accès à la culture
      'r38c1': ['theme-29'],
      'r38c2': ['chip-87', 'chip-88', 'chip-89']
    };
    
    setRows(newRows);
    setCells(newCells);
    setBankChips([]);
    setCustomChips({});
    
    // Sauvegarder immédiatement
    const state = {
      version: 3,
      rows: newRows,
      cells: newCells,
      bank: [],
      custom: {},
      lastModified: Date.now()
    };
    
    localStorage.setItem(config.storageKey, JSON.stringify(state));
    sharedStateManager.saveToShared(config.storageKey, state);
  };

  const initializeDefault = () => {
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
      lastModified: Date.now()
    };
    
    restoreState(progressionData);
  };

  const restoreState = (state: any) => {
    // Handle rows
    if (state.rows && Array.isArray(state.rows)) {
      const restoredRows = state.rows.map((r: any) => ({
        label: r.label || '',
        type: r.label === 'Vacances' ? 'vac' : (r.type === 'vac' ? 'vac' : 'week')
      }));
      setRows(restoredRows);
    } else {
      initializeDefault();
      return;
    }

    // Handle cells
    setCells(state.cells || {});

    // Handle bank
    setBankChips(state.bank || []);

    // Handle custom chips - merge with config
    let customChipsMap = {};
    
    // Start with config custom labels
    if (config.customLabels && typeof config.customLabels === 'object') {
      customChipsMap = { ...config.customLabels };
    }
    
    // Merge with saved custom chips
    if (state.custom && typeof state.custom === 'object') {
      customChipsMap = { ...customChipsMap, ...state.custom };
    }
    
    // Find all custom chip IDs used in the progression
    const allChipIds = new Set<string>();
    Object.values(state.cells || {}).forEach((chipIds: string[]) => {
      if (Array.isArray(chipIds)) {
        chipIds.forEach(id => allChipIds.add(id));
      }
    });
    if (Array.isArray(state.bank)) {
      state.bank.forEach((id: string) => allChipIds.add(id));
    }
    
    // Generate temporary labels for missing custom chips
    allChipIds.forEach(id => {
      if (id.startsWith('custom-') && !customChipsMap[id]) {
        customChipsMap[id] = `Étiquette personnalisée (${id.split('-').slice(-1)[0]})`;
      }
    });

    setCustomChips(customChipsMap);
  };

  const saveState = () => {
    const state: AppState = {
      version: 3,
      rows,
      cells,
      bank: bankChips,
      custom: customChips
    };
    
    localStorage.setItem(config.storageKey, JSON.stringify(state));
    sharedStateManager.saveToShared(config.storageKey, state);
  };

  useEffect(() => {
    saveState();
  }, [rows, cells, bankChips, customChips]);

  // Subscribe to shared changes
  useEffect(() => {
    const unsubscribe = sharedStateManager.subscribeToChanges(config.storageKey, (sharedData) => {
      const currentData = localStorage.getItem(config.storageKey);
      let shouldUpdate = true;
      
      if (currentData) {
        try {
          const localData = JSON.parse(currentData);
          if (localData.lastModified && sharedData.lastModified) {
            shouldUpdate = sharedData.lastModified > localData.lastModified;
          }
        } catch (error) {
          console.warn('Erreur lors de la comparaison des données:', error);
        }
      }
      
      if (shouldUpdate) {
        restoreState(sharedData);
      }
    });

    return unsubscribe;
  }, [config.storageKey]);

  const createCustomChip = () => {
    const label = newLabel.trim();
    if (!label) return;

    const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    setCustomChips(prev => ({ ...prev, [id]: label }));
    setBankChips(prev => [...prev, id]);
    setNewLabel('');
  };

  const addRow = () => {
    const weekNumbers = rows
      .filter(r => r.type === 'week' && /^\d+$/.test(r.label))
      .map(r => parseInt(r.label, 10));
    const nextWeek = Math.max(0, ...weekNumbers) + 1;
    
    setRows(prev => [...prev, {
      label: String(nextWeek).padStart(2, '0'),
      type: 'week'
    }]);
  };

  const addVacationRow = () => {
    setRows(prev => [...prev, {
      label: 'Vacances',
      type: 'vac'
    }]);
  };

  const moveRow = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === rows.length - 1) return;

    const newRows = [...rows];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newRows[index], newRows[targetIndex]] = [newRows[targetIndex], newRows[index]];
    
    setRows(newRows);
    
    // Update cell IDs
    const newCells: Record<string, string[]> = {};
    
    Object.entries(cells).forEach(([cellId, chipIds]) => {
      const match = cellId.match(/^r(\d+)c(\d+)$/);
      if (match) {
        const rowNum = parseInt(match[1], 10);
        const colNum = parseInt(match[2], 10);
        
        let newRowNum = rowNum;
        if (rowNum === index + 1) {
          newRowNum = targetIndex + 1;
        } else if (rowNum === targetIndex + 1) {
          newRowNum = index + 1;
        }
        
        newCells[`r${newRowNum}c${colNum}`] = chipIds;
      } else {
        newCells[cellId] = chipIds;
      }
    });
    
    setCells(newCells);
    
    // Renumber weeks after moving
    renumberWeeks(newRows);
  };

  const renumberWeeks = (rowsToRenumber: Row[]) => {
    let weekCounter = 1;
    const updatedRows = rowsToRenumber.map(row => {
      if (row.type === 'week') {
        return { ...row, label: String(weekCounter++).padStart(2, '0') };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const handleDragStart = (chipId: string) => {
    setDraggedChip(chipId);
  };

  const handleDragEnd = () => {
    setDraggedChip(null);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedChip) return;

    // Remove chip from its current location
    const newCells = { ...cells };
    const newBankChips = [...bankChips];

    // Remove from bank
    const bankIndex = newBankChips.indexOf(draggedChip);
    if (bankIndex > -1) {
      newBankChips.splice(bankIndex, 1);
    }

    // Remove from cells
    Object.keys(newCells).forEach(cellId => {
      const chipIndex = newCells[cellId].indexOf(draggedChip);
      if (chipIndex > -1) {
        newCells[cellId].splice(chipIndex, 1);
      }
    });

    // Add to target
    if (targetId === 'bank') {
      newBankChips.push(draggedChip);
    } else if (targetId === 'trash') {
      // Remove from custom chips if it's a custom chip
      if (draggedChip.startsWith('custom-')) {
        const newCustomChips = { ...customChips };
        delete newCustomChips[draggedChip];
        setCustomChips(newCustomChips);
      }
    } else {
      // Add to cell
      if (!newCells[targetId]) {
        newCells[targetId] = [];
      }
      newCells[targetId].push(draggedChip);
    }

    setCells(newCells);
    setBankChips(newBankChips);
    setDraggedChip(null);
  };

  const returnToBank = (chipId: string) => {
    setDraggedChip(chipId);
    handleDrop('bank');
  };

  const deleteChip = (chipId: string) => {
    if (confirm('Supprimer définitivement cette étiquette ?')) {
      setDraggedChip(chipId);
      handleDrop('trash');
    }
  };

  const renameChip = (chipId: string) => {
    if (!chipId.startsWith('custom-')) return;
    
    const currentLabel = customChips[chipId] || '';
    const newLabel = prompt('Nouveau libellé :', currentLabel);
    
    if (newLabel && newLabel.trim()) {
      setCustomChips(prev => ({
        ...prev,
        [chipId]: newLabel.trim()
      }));
    }
  };

  const getChipLabel = (chipId: string): string => {
    if (chipId.startsWith('custom-')) {
      return customChips[chipId] || 'Étiquette personnalisée';
    }
    
    if (chipId.startsWith('theme-')) {
      const themeIndex = parseInt(chipId.split('-')[1], 10);
      return config.themes[themeIndex] || `Thème ${themeIndex + 1}`;
    }
    
    if (chipId.startsWith('chip-')) {
      const chipIndex = parseInt(chipId.split('-')[1], 10);
      return config.grammarPoints[chipIndex] || `Point grammatical ${chipIndex + 1}`;
    }
    
    return chipId;
  };

  const exportJson = () => {
    const state: AppState = {
      version: 3,
      rows,
      cells,
      bank: bankChips,
      custom: customChips
    };
    
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.storageKey}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        restoreState(importedData);
        alert('✅ Progression importée avec succès !');
      } catch (error) {
        alert('❌ Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exportDoc = () => {
    const html = buildDocHTML();
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.storageKey}-${new Date().toISOString().split('T')[0]}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const html = buildDocHTML();
    const newWindow = window.open('', 'PRINT', 'height=800,width=1000');
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(html);
      newWindow.document.close();
      newWindow.focus();
      newWindow.print();
    }
  };

  const buildDocHTML = (): string => {
    const tableRows = rows.map((row, index) => {
      const rowId = index + 1;
      const themes = cells[`r${rowId}c1`]?.map(id => getChipLabel(id)).join(' • ') || '';
      const grammar = cells[`r${rowId}c2`]?.map(id => getChipLabel(id)).join(' • ') || '';
      
      const isVacation = row.type === 'vac';
      const rowStyle = isVacation ? 'style="background: #fff3cd; color: #856404; font-weight: bold;"' : '';
      
      return `<tr ${rowStyle}>
        <th style="text-align:right;padding:.6rem .8rem;background: #f8f9fa;border-right: 2px solid #dee2e6;font-weight:bold;${isVacation ? 'background: #fff3cd;' : ''}">${row.label}</th>
        <td>${themes}</td>
        <td>${grammar}</td>
      </tr>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${config.title}</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; color: #2c3e50; margin: 0; line-height: 1.4; }
    .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 3px solid #3498db; }
    .header h1 { margin: 0; font-size: 28px; color: #2c3e50; font-weight: 700; }
    .header .subtitle { color: #7f8c8d; margin: 0.5rem 0 0 0; font-size: 16px; }
    table { border-collapse: collapse; width: 100%; font-size: 13px; }
    thead th { background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 1rem 0.8rem; text-align: left; font-weight: 700; }
    tbody tr:nth-child(even) { background: #f8f9fa; }
    tbody th { background: #f8f9fa; color: #2c3e50; border-right: 2px solid #dee2e6; padding: 0.6rem 0.8rem; text-align: right; font-weight: bold; }
    tbody td { border-bottom: 1px solid #dee2e6; padding: 0.7rem 0.8rem; vertical-align: top; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📚 ${config.title}</h1>
    <div class="subtitle">${config.subtitle}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>📅 Semaine</th>
        <th>🎨 Thèmes</th>
        <th>📚 Points Grammaticaux</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`;
  };

  const resetAll = () => {
    if (confirm('Réinitialiser et supprimer toutes les données ?')) {
      initializeDefault();
      localStorage.removeItem(config.storageKey);
    }
  };

  const filteredBankChips = bankChips.filter(chipId => {
    const label = getChipLabel(chipId).toLowerCase();
    return label.includes(searchTerm.toLowerCase());
  });

  const renderChip = (chipId: string) => {
    const label = getChipLabel(chipId);
    const isCustom = chipId.startsWith('custom-');
    
    return (
      <div
        key={chipId}
        className="chip"
        draggable={!isReadOnly}
        onDragStart={!isReadOnly ? () => handleDragStart(chipId) : undefined}
        onDragEnd={!isReadOnly ? handleDragEnd : undefined}
        style={isReadOnly ? { cursor: 'default' } : {}}
      >
        <span className="handle"></span>
        <span className="label">{label}</span>
        {isCustom && !isReadOnly && (
          <button className="edit" onClick={() => renameChip(chipId)} title="Renommer">
            ✎
          </button>
        )}
        {!isReadOnly && (
          <>
            <button className="remove" onClick={() => returnToBank(chipId)} title="Renvoyer à la banque">
              ×
            </button>
            <button className="trash" onClick={() => deleteChip(chipId)} title="Supprimer définitivement">
              🗑
            </button>
          </>
        )}
      </div>
    );
  };

  const renderDropZone = (cellId: string) => {
    const chipIds = cells[cellId] || [];
    
    return (
      <div
        className="dropzone"
        onDragOver={!isReadOnly ? (e) => e.preventDefault() : undefined}
        onDrop={!isReadOnly ? () => handleDrop(cellId) : undefined}
        style={isReadOnly ? { borderStyle: 'solid', borderColor: '#e5e7eb' } : {}}
      >
        {chipIds.map(chipId => renderChip(chipId))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      {/* Bank Panel */}
      <section className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 ${isReadOnly ? 'opacity-75' : ''}`}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            {isReadOnly ? '👁️ Banque d\'étiquettes (Lecture seule)' : '🎯 Banque d\'étiquettes'}
          </h2>
          
          {isReadOnly && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-700">
                <strong>Mode consultation :</strong> Vous visualisez la dernière version sauvegardée.
              </p>
            </div>
          )}
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="search"
              placeholder="Rechercher…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isReadOnly}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:bg-white/70 transition-all"
            />
          </div>

          {/* Bank */}
          <div
            className="max-h-96 overflow-y-auto space-y-2 mb-4"
            onDragOver={!isReadOnly ? (e) => e.preventDefault() : undefined}
            onDrop={!isReadOnly ? () => handleDrop('bank') : undefined}
          >
            {filteredBankChips.map(chipId => renderChip(chipId))}
          </div>

          {!isReadOnly && (
            <>
              {/* Add Custom */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Nouvelle étiquette…"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createCustomChip()}
                  className="flex-1 px-3 py-2 bg-white/50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:bg-white/70 transition-all"
                />
                <button
                  onClick={createCustomChip}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={addRow} className="btn-secondary">
                  <Calendar className="w-4 h-4" />
                  + Ligne
                </button>
                <button onClick={addVacationRow} className="btn-secondary">
                  🏖️ + Vacances
                </button>
                <button onClick={exportJson} className="btn-secondary">
                  <FileDown className="w-4 h-4" />
                  Export JSON
                </button>
                <button onClick={importJson} className="btn-secondary">
                  <FileUp className="w-4 h-4" />
                  Import JSON
                </button>
                <button onClick={exportDoc} className="btn-secondary">
                  <FileText className="w-4 h-4" />
                  Word
                </button>
                <button onClick={exportPdf} className="btn-secondary">
                  <Printer className="w-4 h-4" />
                  PDF
                </button>
              </div>

              <button onClick={resetAll} className="w-full btn-danger mb-4">
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </button>

              {/* Trash Zone */}
              <div
                className="border-2 border-dashed border-red-400 bg-red-50 rounded-xl p-4 text-center text-red-700 font-semibold"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop('trash')}
              >
                <Trash2 className="w-6 h-6 mx-auto mb-2" />
                <strong>Corbeille</strong>
                <br />
                Déposez ici pour supprimer
              </div>
            </>
          )}

          {/* Export only controls for read-only mode */}
          {isReadOnly && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={exportDoc} className="btn-secondary">
                <FileText className="w-4 h-4" />
                Word
              </button>
              <button onClick={exportPdf} className="btn-secondary">
                <Printer className="w-4 h-4" />
                PDF
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Table Panel */}
      <section className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30">
        <div className="p-6">
          <div className="overflow-auto max-h-[calc(100vh-200px)]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-left font-bold sticky top-0">
                    📅 Semaine
                  </th>
                  <th className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-left font-bold sticky top-0">
                    🎨 Thèmes
                  </th>
                  <th className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-left font-bold sticky top-0">
                    📚 Grammaire
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className={`${row.type === 'vac' ? 'bg-yellow-50' : 'hover:bg-blue-50'} transition-colors`}>
                    <th className={`p-3 text-right font-bold border-b border-gray-200 ${row.type === 'vac' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-end gap-2">
                        <span>{row.label}</span>
                        {!isReadOnly && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveRow(index, 'up')}
                              disabled={index === 0}
                              className="w-6 h-6 bg-white border rounded text-xs hover:bg-gray-100 disabled:opacity-30"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => moveRow(index, 'down')}
                              disabled={index === rows.length - 1}
                              className="w-6 h-6 bg-white border rounded text-xs hover:bg-gray-100 disabled:opacity-30"
                            >
                              ▼
                            </button>
                          </div>
                        )}
                      </div>
                    </th>
                    <td className="p-3 border-b border-gray-200">
                      {renderDropZone(`r${index + 1}c1`)}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {renderDropZone(`r${index + 1}c2`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileImport}
        className="hidden"
      />
    </div>
  );
}