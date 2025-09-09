import fs from 'fs';
import path from 'path';

const filesToExport = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'tailwind.config.js',
  'postcss.config.js',
  'eslint.config.js',
  'index.html',
  'src/main.tsx',
  'src/App.tsx',
  'src/index.css',
  'src/vite-env.d.ts',
  'src/components/HomePage.tsx',
  'src/components/Navigation.tsx',
  'src/components/ProgressionApp.tsx',
  'src/data/progressionConfigs.ts',
  'src/utils/sharedState.ts'
];

console.log('='.repeat(80));
console.log('📁 EXPORT DU PROJET ISPA PROGRESSIONS');
console.log('='.repeat(80));

filesToExport.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 FICHIER: ${filePath}`);
    console.log(`${'='.repeat(60)}`);
    
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      console.log(content);
    } catch (error) {
      console.log(`❌ Erreur lors de la lecture de ${filePath}: ${error.message}`);
    }
  } else {
    console.log(`\n⚠️  Fichier non trouvé: ${filePath}`);
  }
});

console.log(`\n${'='.repeat(80)}`);
console.log('✅ EXPORT TERMINÉ');
console.log(`${'='.repeat(80)}`);