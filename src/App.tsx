import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Calendar, FileDown, FileUp, FileText, Printer, RotateCcw, Trash2 } from 'lucide-react';

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

// Thèmes B1→B2 (index 0-37 pour theme-1 à theme-38)
const themes = [
  "LES LOISIRS", "LE LOGEMENT", "LA LITTÉRATURE", "LES ÉTUDES SUPÉRIEURES", 
  "PARIS, CAPITALE", "REUSSIR SA CANDIDATURE", "LE CINÉMA", "LES MÉDIAS", 
  "SANTÉ", "GRANDS REPÈRES HISTORIQUES", "COMMERCE et ECONOMIE", "LE SYSTÈME POLITIQUE", 
  "L'ÉCOLOGIE", "LA GASTRONOMIE", "LES TRANSPORTS PROPRES", "MEDECINES ALTERNATIVES", 
  "LIBERTÉ, ÉGALITÉ, FRATERNITÉ…", "LA PARITE", "LA VIE ASSOCIATIVE", "LE TOURISME", 
  "LE MONDE NUMERIQUE", "SPORT", "ANALYSE D'UNE OEUVRE D'ART", "METEO et PHENOMENES NATURELS", 
  "LE MONDE PROFESSIONNEL", "LES CLICHÉS", "L'ENQUÊTE", "LA MUSIQUE", "LE SYSTEME SCOLAIRE", 
  "LA MODE", "ACCES A LA CULTURE", "LE CALENDRIER FRANCAIS", "VILLE(S) ET HISTOIRE", 
  "LE ROMANTISME", "LES SCIENCES", "LA FRANCOPHONIE", "CULTURES REGIONALES", "GEOGRAPHIE"
];

// Points grammaticaux B1→B2
const grammarPoints = [
  "Négation complexe (ne… plus, jamais, rien, personne)",
  "Subjonctif présent",
  "Subjonctif passé", 
  "Concordance des temps (subordonnées)",
  "Plus-que-parfait",
  "Conditionnel présent",
  "Conditionnel passé",
  "Discours indirect au présent",
  "Discours indirect au passé",
  "Pronoms relatifs simples (qui, que, où, dont)",
  "Pronoms relatifs composés (lequel, auquel, duquel…)",
  "Pronoms démonstratifs (celui, celle, ceux…)",
  "Pronoms possessifs (le mien, la tienne…)",
  "Pronoms EN et Y",
  "Voix passive",
  "Gérondif",
  "Participe présent",
  "Accord du participe passé",
  "Expressions temporelles: depuis / il y a / pendant / cela fait",
  "Futur proche",
  "Futur simple",
  "Futur antérieur",
  "Négation étendue (ne… aucun / guère / ni… ni)",
  "Mise en relief (c'est… qui/que ; ce qui/que)",
  "Hypothèses avec si (présent → futur)",
  "Hypothèses avec si (imparfait → conditionnel présent)",
  "Hypothèses avec si (plus-que-parfait → conditionnel passé)",
  "Concessions (bien que, quoique, même si)",
  "Cause & conséquence (parce que, puisque, donc, ainsi)",
  "Connecteurs logiques (tandis que, toutefois, néanmoins, en outre…)",
  "Comparatifs & superlatifs",
  "Tournures idiomatiques fréquentes",
  "Verbes à préposition (à / de)",
  "Passé simple (réception/compréhension)",
  "Fonctions de l'adjectif (accord ; épithète/attribut)",
  "Comparatif d'égalité (aussi… que)",
  "Déterminants (définis, indéfinis, partitifs)",
  "Articles contractés (au, du, des)",
  "Pronoms toniques (moi, toi, lui…)",
  "Discours indirect avec conditionnel",
  "Infinitif passé (avant de / après avoir…)",
  "Subordonnées temporelles (quand, lorsque, avant que, après que)",
  "Expression de la durée (pendant que, depuis que, autant que)",
  "Opposition (alors que, malgré, bien que…)",
  "Structures corrélatives (non seulement… mais aussi…)",
  "Phrases complexes (relatives, causales, consécutives)",
  "Modalité (devoir, falloir, pouvoir ; évaluation)",
  "Adverbes (quantité, fréquence, intensité)",
  "Interrogation (est‑ce que, inversion, question indirecte)",
  "Exclamatives & inversions stylistiques"
];

// Libellés personnalisés (extraits du HTML original)
const customLabels: Record<string, string> = {
  'custom-mfatxpgj-mtf7': 'Déterminants (définis, indéfinis, partitifs) PO',
  'custom-mfatyr5q-e8n7': 'Pronoms possessifs (le mien, la tienne...) CO',
  'custom-mfatz8l8-lu3d': 'Pronoms démonstratifs (celui, celle, ceux...) CO',
  'custom-mfau08nv-d88v': 'Pronoms relatifs simples (qui, que, où, dont) CE',
  'custom-mfau1fen-4vy0': 'Pronoms relatifs composés (lequel, auquel, duquel...)',
  'custom-mf586mnn-ijec': 'Les articulateurs chronologiques du discours (d\'abord, ensuite, enﬁn/premièrement, deuxièmement…) CO',
  'custom-mfau29fj-oi7a': 'Discours indirect au présent (CO)',
  'custom-mf53ryg3-hrgt': 'REVISION - REMEDIATION des temps simples et du passé composé',
  'custom-mfau4bea-c3wh': 'Futur proche (PO)',
  'custom-mfau4gdm-vlp7': 'Futur simple (PO)',
  'custom-mf57jjnd-wp61': 'PARIS CAPITALE',
  'custom-mf53u3l8-gxas': 'Les articulations logiques simples : cause, conséquence, opposition (donc, puisque, comme, alors, pourtant, alors que…) CO',
  'custom-mf58cxfn-7m4p': 'Accord du participe passé : être (avec le sujet) et avoir (avec le COD) CO',
  'custom-mf53uz2p-a04m': 'Donner son point de vue PO',
  'custom-mfau7bd2-d3xi': 'Comparatif des verbes et des adverbes PO',
  'custom-mfau8ig7-mzey': 'Superlatif de l\'adjectif et de l\'adverbe (le mieux, le meilleur...) PO',
  'custom-mf53z10u-b2so': 'Défendre un point de vue PE PO',
  'custom-mf53uj2l-3ikw': 'Nominalisation PE',
  'custom-mfaubksd-fey6': 'Conditionnel présent : le souhait, le désir, l\'hypothèse (faits imaginaires) avec tu et vous PO Le conditionnel ou l\'impératif : la prière PE',
  'custom-mf5407di-jztc': 'Donner un ordre (impératif) et des conseils (conditionnel, "il faut que"+subjonctif)',
  'custom-mf542aqp-39sc': 'Les chiffres, les dates, les chiffres romains',
  'custom-mf542xfy-3zjd': 'Révision temps du passé (PC, imparfait)',
  'custom-mf543bdq-ziw2': 'Le plus que parfait (formation et utilisation) CO',
  'custom-mf544o25-49dr': 'Négation et restriction (ne...que, ni...ni, sans+infinitif) PO',
  'custom-mf545fj2-ugmb': 'Tournures impersonnelles (il est interdit de..., il est utile de...) PE',
  'custom-mf54p9yj-i52h': 'REVISION - REMEDIATION (plus que parfait + points de grammaire)',
  'custom-mfauzt3p-qk9y': 'L\'hypothèse certaine/sur le futur (la condition) : si + présent, futur PO CE',
  'custom-mfav5ow8-0zkt': 'L\'hypothèse incertaine sur le présent : si + imparfait, conditionnel CE PO',
  'custom-mfaw2fjc-dbqu': 'Pronoms Y et EN (+verbes à préposition) CO',
  'custom-mfav89ze-y2tc': 'Verbes à prépositions (penser à, croire à/en, rêver de, décider de, agir sur…) CO',
  'custom-mf54cg5f-vr0a': 'Pronoms relatifs composés CO',
  'custom-mfaxmo88-xnx1': 'Modalité (Falloir + infinitif, Devoir + inﬁnitif : capacité, autorisation ou éventualité PE Pouvoir +inﬁnitif : obligation ou supposition) PE',
  'custom-mf55mj5j-celb': 'Les doubles pronoms CO',
  'custom-mfawl7ws-6bwn': 'Subjonctif présent (conjonctions + subjonctif ou indicatif) CO (conjonctions + subjonctif ou inﬁnitif) CO',
  'custom-mf54juqt-6byc': 'Révision des comparatifs (adjectifs, adverbes, verbes)',
  'custom-mf54jail-csvw': 'Les formes impersonnelles 2 (il est certain que..., il est possible que..., il semble que...) CO',
  'custom-mf54msgr-xfr5': 'REVISION - REMEDIATION (plus que parfait + points de grammaire)',
  'custom-mfaw45pt-p5os': 'Gérondif : la manière, la condition, la simultanéité CO',
  'custom-mfaw5ser-nzsq': 'Participe présent CE',
  'custom-mf54wfu7-vkea': 'Cause, conséquence, but',
  'custom-mfaw78b7-mrv7': 'Conditionnel passé : le regret, le reproche CE/PO',
  'custom-mf550ie7-9gv4': 'Révision repères spatio-temporels et adverbes de lieu CO',
  'custom-mf5865f2-cni1': 'Adverbes (quantité, fréquence, intensité, temps)',
  'custom-mf58chud-4b2p': 'Révision Accord du participe passé',
  'custom-mfauh4df-0hng': 'Expressions temporelles : les prépositions et expression de la durée (pendant, depuis), expression du moment (dans, il y a) et adverbes de temps (cela fait...que...) CO',
  'custom-mfaujiqk-ar6t': 'Expression de la durée (pendant que, depuis que, autant que, cela fait...que...) CO',
  'custom-mfaxd2v3-bazg': 'Le subjonctif : la possibilité, l\'obligation CO La conjonction pour que + subjonctif CO Quelques verbes d\'opinion + subjonctif CE Quelques verbes d\'ordre + subjonctif PO Quelques verbes de sentiments + subjonctif CE',
  'custom-mf55ft87-l8kq': 'Les doubles pronoms CO',
  'custom-mf53wi67-murl': 'Adverbes de manière en _ment CE',
  'custom-mf55nc41-z23n': 'REVISION - REMEDIATION',
  'custom-mfaurz9k-dlmg': 'Concordance des temps (subordonnées) CO CE PE',
  'custom-mf548nl6-8898': 'Conjonctions + subjonctif',
  'custom-mf55vqk5-k6xi': 'Révision phrases nominales et phrases verbales',
  'custom-mf55x55o-135w': 'Révion des temps',
  'custom-mf55ylur-t58g': 'Le passif : La description d\'une action/la mise en valeur du sujet de la phrase à la place du pronom on (quand on ne connait pas l\'auteur de l\'action), procédés pour effacer l\'auteur d\'une action CO',
  'custom-mf56b53q-h64k': 'La modalisation',
  'custom-mf57dz4g-rzvd': 'Les adjectifs accompagnés de prépositions (être heureux de, prêt à, sûr de, confiant en, remarquable par) CO',
  'custom-mfaxj3ll-qkon': 'Verbes + subjonctif ou indicatif CO Verbes + subjonctif ou inﬁnitif CO',
  'custom-mf57ehmh-oawb': 'L\'antériorité, la simultanéité, la postériorité : concordance des temps et articulateurs logiques, le passé surcomposé : le passé dans le passé, le subjonctif passé CE',
  'custom-mf57f539-5c0i': 'Les verbes accompagnés de préposition : penser à, croire à/en, rêver de, décider de, agir sur',
  'custom-mf57fl9e-53uc': 'L\'expression de l\'hypothèse incertaine : si + imparfait/conditionnel présent ou passé PE',
  'custom-mf57fsa9-t7gm': 'L\'expression de l\'hypothèse non réalisée (le regret) : si + plus-que-parfait/conditionnel passé',
  'custom-mf56elbt-lzcg': 'VIE QUOTIDIENNE',
  'custom-mf56nt3h-tqs3': 'CONSOMMATION RESPONSABLE',
  'custom-mf56nzx2-2rut': 'VIE EN SOCIETE',
  'custom-mf57jrn4-3c6s': 'LES FETES ET LES CELEBRATIONS FRANCAISES',
  'custom-mf57jvug-ojm9': 'LES ARTS',
  'custom-mf57k01r-7iir': 'LE ROMANTISME',
  'custom-mf57k5tq-h2ds': 'LA FRANCOPHONIE',
  'custom-mf57msdx-gmrs': 'LE BIEN-ETRE',
  'custom-mf57myaz-4a3r': 'LES TEMPS LIBRES',
  'custom-mf57n5ym-rhu4': 'LE TOURISME DANS LES HAUTS DE FRANCE',
  'custom-mf57nckp-8627': 'LA LITTERATURE FRANCOPHONE',
  'custom-mf57nin9-f340': 'POUR UN MONDE MEILLEUR',
  'custom-mf57nptz-4qqw': 'LES FRANCAIS ET LES VACANCES',
  'custom-mf57oayk-gp18': 'LA NATURE : LES DIFFERENTS VISAGES DE LA FRANCE',
  'custom-mf57oef1-dk4i': 'VIVRE A AMIENS',
  'custom-mf57oiwo-l79z': 'ETRE JEUNE EN FRANCE'
};

export default function App() {
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
    const savedState = localStorage.getItem('progB1B2');
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
  }, []);

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

    // Handle bank
    setBankChips(state.bank || []);

    // Handle custom chips - merge with predefined
    let customChipsMap = { ...customLabels };
    
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
    
    localStorage.setItem('progB1B2', JSON.stringify(state));
  };

  useEffect(() => {
    saveState();
  }, [rows, cells, bankChips, customChips]);

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
      const themeIndex = parseInt(chipId.split('-')[1], 10) - 1; // Décalage car theme-1 = index 0
      return themes[themeIndex] || `Thème ${themeIndex + 1}`;
    }
    
    if (chipId.startsWith('chip-')) {
      const chipIndex = parseInt(chipId.split('-')[1], 10);
      return grammarPoints[chipIndex] || `Point grammatical ${chipIndex + 1}`;
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
    a.download = `progression-b1b2-${new Date().toISOString().split('T')[0]}.json`;
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
    a.download = `progression-b1b2-${new Date().toISOString().split('T')[0]}.doc`;
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
  <title>Progression Annuelle B1→B2</title>
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
    <h1>📚 Progression Annuelle B1→B2</h1>
    <div class="subtitle">Français Langue Étrangère • Niveau B1 → B2</div>
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
      localStorage.removeItem('progB1B2');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Progression Annuelle B1→B2
          </h1>
          <p className="text-white/70 text-sm mt-2">
            Français Langue Étrangère • Organisez les thèmes et points de grammaire par glisser‑déposer
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
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
      </main>

      <footer className="text-center text-white/70 py-8">
        © ISPA Amiens - Progression annuelle B1→B2. Interface locale, aucune donnée transmise.
      </footer>
    </div>
  );
}