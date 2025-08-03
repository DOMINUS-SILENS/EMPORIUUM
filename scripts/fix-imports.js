#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration des alias
const ALIASES = {
  '@types': 'packages/types/src',
  '@types-user': 'packages/types-user/src',
  '@shared-types': 'packages/shared-types/src',
  '@ui-core': 'packages/ui-core/src',
  '@ui': 'packages/ui/src',
  '@components': 'packages/components',
  '@utils': 'packages/utils/src',
  '@services': 'packages/services/src',
  '@api-client': 'packages/api-client/src',
  '@hooks': 'packages/hooks/src',
  '@hooks-auth': 'packages/hooks-auth/src',
  '@hooks-shared': 'packages/hooks-shared/src',
  '@schemas': 'packages/schemas/src',
  '@schemas-zod': 'packages/schemas-zod/src',
  '@form-generator': 'packages/form-generator/src',
  '@form-configs': 'packages/form-configs/src',
  '@config-vite': 'packages/config-vite/src',
  '@config-env': 'packages/config-env/src',
  '@py-common': 'packages/py-common/src'
};

// Patterns d'imports relatifs à corriger
const RELATIVE_PATTERNS = [
  /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/packages\/([^'"]+)['"]/g,
  /from\s+['"]\.\.\/\.\.\/\.\.\/packages\/([^'"]+)['"]/g,
  /from\s+['"]\.\.\/\.\.\/packages\/([^'"]+)['"]/g,
  /from\s+['"]\.\.\/packages\/([^'"]+)['"]/g,
  /from\s+['"]packages\/([^'"]+)['"]/g
];

// Patterns d'imports avec anciens alias
const OLD_ALIAS_PATTERNS = [
  /from\s+['"]@commercium\/types['"]/g,
  /from\s+['"]@commercium\/types\/([^'"]+)['"]/g
];

function findTsFiles() {
  return glob.sync('apps/**/*.{ts,tsx}', { ignore: ['**/node_modules/**', '**/dist/**'] });
}

function findPackageFiles() {
  return glob.sync('packages/**/*.{ts,tsx}', { ignore: ['**/node_modules/**', '**/dist/**'] });
}

function getRelativePath(fromFile, toPackage) {
  const fromDir = path.dirname(fromFile);
  const relativePath = path.relative(fromDir, toPackage);
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function findBestAlias(packagePath) {
  for (const [alias, targetPath] of Object.entries(ALIASES)) {
    if (packagePath.startsWith(targetPath)) {
      const remainingPath = packagePath.slice(targetPath.length);
      return `${alias}${remainingPath}`;
    }
  }
  return null;
}

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Corriger les imports relatifs vers packages
  for (const pattern of RELATIVE_PATTERNS) {
    content = content.replace(pattern, (match, packagePath) => {
      const alias = findBestAlias(`packages/${packagePath}`);
      if (alias) {
        modified = true;
        console.log(`✅ ${filePath}: ${match} → ${alias}`);
        return `from '${alias}'`;
      }
      return match;
    });
  }

  // Corriger les anciens alias
  for (const pattern of OLD_ALIAS_PATTERNS) {
    content = content.replace(pattern, (match, subPath) => {
      modified = true;
      const newAlias = subPath ? `@types/${subPath}` : '@types';
      console.log(`✅ ${filePath}: ${match} → ${newAlias}`);
      return `from '${newAlias}'`;
    });
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function main() {
  console.log('🔧 Correction automatique des imports...\n');

  const allFiles = [...findTsFiles(), ...findPackageFiles()];
  let fixedCount = 0;

  for (const file of allFiles) {
    if (fixImportsInFile(file)) {
      fixedCount++;
    }
  }

  console.log(`\n✅ Correction terminée : ${fixedCount} fichiers modifiés`);
}

if (require.main === module) {
  main();
}

module.exports = { fixImportsInFile, findBestAlias }; 