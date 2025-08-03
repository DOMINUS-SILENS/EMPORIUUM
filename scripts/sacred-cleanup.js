const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

// Fonction pour exécuter une commande et afficher sa sortie
const run = (command) => {
  try {
    console.log(`
--- Exécution de: ${command} ---
`);
    execSync(command, { stdio: 'inherit', cwd: projectRoot });
  } catch (error) {
    console.error(`
--- Erreur lors de l'exécution de: ${command} ---
`);
    // L'erreur est déjà affichée par execSync, donc on arrête simplement le script
    process.exit(1);
  }
};

// Fonction pour supprimer des fichiers selon un pattern (équivalent de find + rm)
const deleteFilesByPattern = (dir, patterns) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Ne pas descendre dans node_modules ou .git pour la performance
      if (file !== 'node_modules' && file !== '.git') {
        deleteFilesByPattern(fullPath, patterns);
      }
    } else {
      if (patterns.some(p => fullPath.endsWith(p))) {
        console.log(`Suppression du fichier temporaire: ${fullPath}`);
        fs.unlinkSync(fullPath);
      }
    }
  }
};

console.log('𓂀 INITIATION DU NETTOYAGE SACRÉ...');

// 1. Supprimer les fichiers inutiles générés
console.log('\n--- Suppression des fichiers temporaires ---');
deleteFilesByPattern(projectRoot, ['.log', '.tmp', '~', 'Thumbs.db', '.DS_Store']);

// 2. Nettoyer les dépendances (en supposant que pnpm est installé)
// Note: l'utilisateur doit installer pnpm globalement via `npm install -g pnpm`
run('pnpm install');
run('pnpm dedupe');
// 'pnpm prune' est obsolète, `pnpm install` gère le nettoyage.

// 3. Lint + fix automatique
console.log('\n𓂀 FORMATAGE DU CODE AVEC ESLINT ET PRETTIER');
run('pnpm exec eslint . --ext .ts,.tsx --fix');
run('pnpm exec prettier --write .');

// 4. Analyse des éléments non utilisés
console.log('\n𓁿 ANALYSE DES ÉLÉMENTS NON UTILISÉS');
run('pnpm exec ts-prune | tee unused.ts-symbols.txt');


console.log('\n𓂀 NETTOYAGE TERMINÉ');
