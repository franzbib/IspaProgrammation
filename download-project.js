import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

// Créer un fichier ZIP avec tous les fichiers du projet
function createProjectZip() {
  const output = fs.createWriteStream('ispa-progressions-project.zip');
  const archive = archiver('zip', {
    zlib: { level: 9 } // Compression maximale
  });

  output.on('close', function() {
    console.log('✅ Archive créée : ' + archive.pointer() + ' bytes');
    console.log('📁 Fichier : ispa-progressions-project.zip');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  // Ajouter tous les fichiers du projet
  const filesToInclude = [
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'tailwind.config.js',
    'postcss.config.js',
    'eslint.config.js',
    'index.html',
    'src/',
    'public/',
    '.gitignore'
  ];

  filesToInclude.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        archive.directory(fullPath, file);
      } else {
        archive.file(fullPath, { name: file });
      }
    }
  });

  archive.finalize();
}

createProjectZip();