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
  comments: Record<string, string>;
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
}

export default function ProgressionApp({ config }: ProgressionAppProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [cells, setCells] = useState<Record<string, string[]>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
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
        initializeDefault();
      }
    } else {
      initializeDefault();
    }
  }, [config.storageKey]);

  const initializeDefault = () => {
    const defaultRows: Row[] = [];
    for (let i = 1; i <= 50; i++) {
      defaultRows.push({
        label: String(i).padStart(2, '0'),
        type: 'week'
      });
    }
    setRows(defaultRows);
    setCells({});
    setComments({});
    setBankChips([]);
    setCustomChips({});
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

    // Handle comments
    setComments(state.comments || {});

    // Handle bank
    setBankChips(state.bank || []);

    // Handle custom chips with fallback to config
    let customChipsMap = { ...config.customLabels, ...(state.custom || {}) };
    
    // Auto-detect custom chips from cells and bank
    const allChipIds = new Set<string>();
    Object.values(state.cells || {}).forEach((chipIds: string[]) => {
      chipIds.forEach(id => allChipIds.add(id));
    });
    (state.bank || []).forEach((id: string) => allChipIds.add(id));

    // Generate meaningful labels for custom chips without definitions
    let missingCustomCount = 0;
    let recoveredFromConfig = 0;
    
    allChipIds.forEach(id => {
      if (id.startsWith('custom-')) {
        if (config.customLabels[id]) {
          recoveredFromConfig++;
        } else if (!customChipsMap[id]) {
          // Determine context based on placement
          let context = 'Étiquette personnalisée';
          Object.entries(state.cells || {}).forEach(([cellId, chipIds]) => {
            if (chipIds.includes(id)) {
              if (cellId.endsWith('c1')) {
                context = 'Thème personnalisé';
              } else if (cellId.endsWith('c2')) {
                context = 'Point grammatical personnalisé';
              }
            }
          });
          
          const suffix = id.split('-').slice(-1)[0] || 'inconnu';
          customChipsMap[id] = `${context} (${suffix})`;
          missingCustomCount++;
        }
      }
    });

    setCustomChips(customChipsMap);

    // Show recovery message
    if (recoveredFromConfig > 0) {
      alert(`✅ ${recoveredFromConfig} étiquette(s) personnalisée(s) récupérée(s) avec leurs vrais libellés !${missingCustomCount > 0 ? ` ${missingCustomCount} autre(s) étiquette(s) avec libellés par défaut.` : ''}`);
    } else if (missingCustomCount > 0) {
      alert(`${missingCustomCount} étiquette(s) personnalisée(s) importée(s) avec des libellés par défaut. Vous pouvez les renommer en cliquant sur l'icône crayon.`);
    }
  };

  const saveState = () => {
    const state: AppState = {
      version: 3,
      rows,
      cells,
      comments,
      bank: bankChips,
      custom: customChips
    };
    
    // Sauvegarder localement ET dans le système partagé
    localStorage.setItem(config.storageKey, JSON.stringify(state));
    sharedStateManager.saveToShared(config.storageKey, state);
  };

  useEffect(() => {
    saveState();
  }, [rows, cells, comments, bankChips, customChips]);

  // S'abonner aux changements partagés
  useEffect(() => {
    const unsubscribe = sharedStateManager.subscribeToChanges(config.storageKey, (sharedData) => {
      // Vérifier si les données partagées sont plus récentes
      const currentData = localStorage.getItem(config.storageKey);
      let shouldUpdate = true;
      
      if (currentData) {
        try {
          const localData = JSON.parse(currentData);
          // Ne pas écraser si les données locales sont plus récentes
          if (localData.lastModified && sharedData.lastModified) {
            shouldUpdate = sharedData.lastModified > localData.lastModified;
          }
        } catch (error) {
          console.warn('Erreur lors de la comparaison des données:', error);
        }
      }
      
      if (shouldUpdate) {
        console.log('📥 Synchronisation des données partagées pour', config.storageKey);
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
    
    // Update cell IDs and comments
    const newCells: Record<string, string[]> = {};
    const newComments: Record<string, string> = {};
    
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
    
    Object.entries(comments).forEach(([commentId, comment]) => {
      const match = commentId.match(/^r(\d+)$/);
      if (match) {
        const rowNum = parseInt(match[1], 10);
        
        let newRowNum = rowNum;
        if (rowNum === index + 1) {
          newRowNum = targetIndex + 1;
        } else if (rowNum === targetIndex + 1) {
          newRowNum = index + 1;
        }
        
        newComments[`r${newRowNum}`] = comment;
      } else {
        newComments[commentId] = comment;
      }
    });
    
    setCells(newCells);
    setComments(newComments);
    
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

  const updateComment = (rowIndex: number, comment: string) => {
    const commentId = `r${rowIndex + 1}`;
    setComments(prev => ({
      ...prev,
      [commentId]: comment
    }));
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
    handleDrop('bank');
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
    
    // Handle theme-* chips
    if (chipId.startsWith('theme-')) {
      const themeIndex = parseInt(chipId.split('-')[1], 10);
      return config.themes[themeIndex] || `Thème ${themeIndex}`;
    }
    
    // Handle chip-* (grammar points)
    if (chipId.startsWith('chip-')) {
      const chipIndex = parseInt(chipId.split('-')[1], 10);
      return config.grammarPoints[chipIndex] || `Point grammatical ${chipIndex}`;
    }
    
    return chipId;
  };

  const exportJson = () => {
    // Export de la progression actuelle uniquement
    const state: AppState = {
      version: 3,
      rows,
      cells,
      comments,
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

  const exportGlobalJson = () => {
    // Export global de toutes les progressions
    const globalState: Record<string, AppState> = {};
    
    // Ajouter la progression actuelle
    globalState[config.storageKey] = {
      version: 3,
      rows,
      cells,
      comments,
      bank: bankChips,
      custom: customChips
    };
    
    // Ajouter les autres progressions depuis localStorage
    const allConfigs = ['progA1A2', 'progA2B1', 'progB1B2', 'progA2Emploi'];
    allConfigs.forEach(key => {
      if (key !== config.storageKey) {
        const savedData = localStorage.getItem(key);
        if (savedData) {
          try {
            globalState[key] = JSON.parse(savedData);
          } catch (error) {
            console.warn(`Erreur lors de la lecture de ${key}:`, error);
          }
        }
      }
    });
    
    const blob = new Blob([JSON.stringify(globalState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progressions-ispa-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importGlobalJson = () => {
    // Utiliser le même input file mais traiter différemment
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          
          // Vérifier si c'est un export global
          if (importedData.version !== undefined) {
            // Format ancien (progression unique) - appliquer à la page courante
            restoreState(importedData);
            alert('✅ Progression importée sur la page courante !');
          } else {
            // Format nouveau (export global)
            let importedCount = 0;
            let currentProgressionImported = false;
            
            Object.entries(importedData).forEach(([key, state]: [string, any]) => {
              if (typeof state === 'object' && state.version !== undefined) {
                localStorage.setItem(key, JSON.stringify(state));
                importedCount++;
                
                // Si c'est la progression actuelle, l'appliquer immédiatement
                if (key === config.storageKey) {
                  restoreState(state);
                  currentProgressionImported = true;
                }
              }
            });
            
            if (importedCount > 0) {
              alert(`✅ ${importedCount} progression(s) importée(s) avec succès !${currentProgressionImported ? ' La progression actuelle a été mise à jour.' : ''}`);
              
              // Recharger la page pour actualiser toutes les données
              if (!currentProgressionImported) {
                window.location.reload();
              }
            } else {
              alert('❌ Aucune progression valide trouvée dans le fichier.');
            }
          }
        } catch (error) {
          alert('❌ Fichier JSON invalide.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Détecter le format du fichier
        if (importedData.version !== undefined) {
          // Nouveau format avec version
          restoreState(importedData);
          alert('✅ Progression importée avec succès !');
        } else if (importedData.rows && importedData.cells) {
          // Ancien format sans version (comme votre fichier)
          const convertedState = {
            version: 3,
            rows: importedData.rows.map((r: any) => ({
              label: r.label || '',
              type: r.label === 'Vacances' ? 'vac' : 'week'
            })),
            cells: importedData.cells || {},
            comments: importedData.comments || {},
            bank: importedData.bank || [],
            custom: { ...config.customLabels, ...(importedData.custom || {}) }
          };
          restoreState(convertedState);
          alert('✅ Ancien format importé avec succès !');
        } else if (typeof importedData === 'object' && !importedData.version) {
          // Export global (plusieurs progressions)
          const currentState = importedData[config.storageKey];
          if (currentState && currentState.version !== undefined) {
            restoreState(currentState);
            alert('✅ Progression importée depuis l\'export global !');
          } else {
            alert('❌ Cette progression n\'est pas présente dans le fichier global.');
          }
        } else {
          alert('❌ Format de fichier non reconnu.');
        }
      } catch (error) {
        alert('❌ Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
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
      const comment = comments[`r${rowId}`] || '';
      
      const isVacation = row.type === 'vac';
      const rowStyle = isVacation ? 'style="background: #fff3cd; color: #856404; font-weight: bold;"' : '';
      
      return `<tr ${rowStyle}>
        <th style="text-align:right;padding:.6rem .8rem;background: #f8f9fa;border-right: 2px solid #dee2e6;font-weight:bold;${isVacation ? 'background: #fff3cd;' : ''}">${row.label}</th>
        <td>${themes}</td>
        <td>${grammar}</td>
        <td style="font-style: italic; color: #666;">${comment}</td>
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
        <th>💬 Commentaires</th>
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
        draggable
        onDragStart={() => handleDragStart(chipId)}
        onDragEnd={handleDragEnd}
      >
        <span className="handle"></span>
        <span className="label">{label}</span>
        {isCustom && (
          <button className="edit" onClick={() => renameChip(chipId)} title="Renommer">
            ✎
          </button>
        )}
        <button className="remove" onClick={() => returnToBank(chipId)} title="Renvoyer à la banque">
          ×
        </button>
        <button className="trash" onClick={() => deleteChip(chipId)} title="Supprimer définitivement">
          🗑
        </button>
      </div>
    );
  };

  const renderDropZone = (cellId: string) => {
    const chipIds = cells[cellId] || [];
    
    return (
      <div
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(cellId)}
      >
        {chipIds.map(chipId => renderChip(chipId))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      {/* Bank Panel */}
      <section className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            🎯 Banque d'étiquettes
          </h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="search"
              placeholder="Rechercher…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:bg-white/70 transition-all"
            />
          </div>

          {/* Bank */}
          <div
            className="max-h-96 overflow-y-auto space-y-2 mb-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('bank')}
          >
            {filteredBankChips.map(chipId => renderChip(chipId))}
          </div>

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
          <button onClick={exportGlobalJson} className="btn-secondary">
            <FileDown className="w-4 h-4" />
            Export Global
          </button>
          <button onClick={importGlobalJson} className="btn-secondary">
            <FileUp className="w-4 h-4" />
            Import Global
            </button>
            <button onClick={exportDoc} className="btn-secondary">
              <FileText className="w-4 h-4" />
              Word (page)
            </button>
            <button onClick={exportPdf} className="btn-secondary">
              <Printer className="w-4 h-4" />
              PDF (page)
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
                  <th className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-left font-bold sticky top-0">
                    💬 Commentaires
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className={`${row.type === 'vac' ? 'bg-yellow-50' : 'hover:bg-blue-50'} transition-colors`}>
                    <th className={`p-3 text-right font-bold border-b border-gray-200 ${row.type === 'vac' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-end gap-2">
                        <span>{row.label}</span>
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
                      </div>
                    </th>
                    <td className="p-3 border-b border-gray-200">
                      {renderDropZone(`r${index + 1}c1`)}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {renderDropZone(`r${index + 1}c2`)}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      <textarea
                        value={comments[`r${index + 1}`] || ''}
                        onChange={(e) => updateComment(index, e.target.value)}
                        placeholder="Commentaire..."
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
                        rows={2}
                      />
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