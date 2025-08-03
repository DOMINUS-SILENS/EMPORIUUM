#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patterns d'imports problématiques
const PROBLEMATIC_PATTERNS = [
  {
    pattern: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/packages\/([^'"]+)['"]/g,
    description: 'Import relatif très profond vers packages'
  },
  {
    pattern: /from\s+['"]\.\.\/\.\.\/\.\.\/packages\/([^'"]+)['"]/g,
    description: 'Import relatif profond vers packages'
  },
  {
    pattern: /from\s+['"]\.\.\/\.\.\/packages\/([^'"]+)['"]/g,
    description: 'Import relatif vers packages'
  },
  {
    pattern: /from\s+['"]\.\.\/packages\/([^'"]+)['"]/g,
    description: 'Import relatif simple vers packages'
  },
  {
    pattern: /from\s+['"]packages\/([^'"]+)['"]/g,
    description: 'Import direct vers packages'
  },
  {
    pattern: /from\s+['"]@commercium\/([^'"]+)['"]/g,
    description: 'Ancien alias @commercium'
  }
];

// Alias valides du monorepo (seulement les internes)
const VALID_MONOREPO_ALIASES = [
  '@types',
  '@types-user',
  '@shared-types',
  '@ui-core',
  '@ui',
  '@components',
  '@utils',
  '@services',
  '@api-client',
  '@hooks',
  '@hooks-auth',
  '@hooks-shared',
  '@schemas',
  '@schemas-zod',
  '@form-generator',
  '@form-configs',
  '@config-vite',
  '@config-env',
  '@py-common'
];

// Alias locaux valides (commençant par @/)
const VALID_LOCAL_ALIASES = [
  '@/',
  '@/components',
  '@/hooks',
  '@/utils',
  '@/services',
  '@/lib',
  '@/contexts',
  '@/pages'
];

// Fichiers de configuration à ignorer
const CONFIG_FILES = [
  'vite.config.ts',
  'tailwind.config.ts',
  'eslint.config.js',
  'tsconfig.json',
  'package.json'
];

function findTsFiles() {
  return [
    ...glob.sync('apps/**/*.{ts,tsx}', { ignore: ['**/node_modules/**', '**/dist/**'] }),
    ...glob.sync('packages/**/*.{ts,tsx}', { ignore: ['**/node_modules/**', '**/dist/**'] })
  ];
}

function isConfigFile(filePath) {
  const fileName = path.basename(filePath);
  return CONFIG_FILES.includes(fileName);
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Ignorer les fichiers de configuration
  if (isConfigFile(filePath)) {
    return issues;
  }
  
  // Vérifier les patterns problématiques
  for (const { pattern, description } of PROBLEMATIC_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        type: 'PROBLEMATIC_IMPORT',
        description,
        matches: matches.length,
        examples: matches.slice(0, 3) // Limiter à 3 exemples
      });
    }
  }
  
  // Vérifier les alias invalides (seulement les alias internes du monorepo)
  const aliasPattern = /from\s+['"](@[^'"]+)['"]/g;
  const aliasMatches = content.match(aliasPattern);
  if (aliasMatches) {
    for (const match of aliasMatches) {
      const alias = match.match(/from\s+['"](@[^'"]+)['"]/)[1];
      
      // Ignorer les alias externes (npm packages)
      if (alias.includes('/') && !alias.startsWith('@/') && !VALID_MONOREPO_ALIASES.some(validAlias => alias.startsWith(validAlias))) {
        // C'est probablement un package npm externe, l'ignorer
        continue;
      }
      
      // Vérifier seulement les alias internes du monorepo
      if (alias.startsWith('@') && !VALID_MONOREPO_ALIASES.some(validAlias => alias.startsWith(validAlias)) && !VALID_LOCAL_ALIASES.some(validAlias => alias.startsWith(validAlias))) {
        issues.push({
          type: 'INVALID_ALIAS',
          description: `Alias invalide du monorepo: ${alias}`,
          alias
        });
      }
    }
  }
  
  return issues;
}

function generateReport(allIssues) {
  console.log('📊 Rapport de vérification des imports\n');
  
  if (allIssues.length === 0) {
    console.log('✅ Aucun problème détecté !');
    return;
  }
  
  // Grouper par type de problème
  const groupedIssues = {};
  for (const issue of allIssues) {
    if (!groupedIssues[issue.type]) {
      groupedIssues[issue.type] = [];
    }
    groupedIssues[issue.type].push(issue);
  }
  
  // Afficher les problèmes par catégorie
  for (const [type, issues] of Object.entries(groupedIssues)) {
    console.log(`\n🔴 ${type}:`);
    
    for (const issue of issues) {
      console.log(`  📁 ${issue.file}`);
      console.log(`     ${issue.description}`);
      if (issue.matches) {
        console.log(`     ${issue.matches} occurrence(s) trouvée(s)`);
      }
      if (issue.examples) {
        console.log(`     Exemples: ${issue.examples.join(', ')}`);
      }
      if (issue.alias) {
        console.log(`     Alias: ${issue.alias}`);
      }
    }
  }
  
  console.log(`\n📈 Total: ${allIssues.length} fichier(s) avec problème(s)`);
  console.log('\n💡 Suggestions:');
  console.log('  - Exécutez "pnpm fix-imports" pour corriger automatiquement');
  console.log('  - Exécutez "pnpm sync-aliases" pour synchroniser les alias');
  console.log('  - Vérifiez la documentation des alias valides');
}

function main() {
  console.log('🔍 Vérification des imports...\n');
  
  const files = findTsFiles();
  const allIssues = [];
  
  for (const file of files) {
    const issues = checkFile(file);
    if (issues.length > 0) {
      allIssues.push(...issues.map(issue => ({ ...issue, file })));
    }
  }
  
  generateReport(allIssues);
  
  if (allIssues.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkFile, findTsFiles, VALID_MONOREPO_ALIASES }; 