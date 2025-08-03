#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration des alias (source de vérité)
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

function updateTsConfigBase() {
  const tsconfigPath = 'tsconfig.base.json';
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  const paths = {};
  for (const [alias, targetPath] of Object.entries(ALIASES)) {
    paths[`${alias}/*`] = [`${targetPath}/*`];
  }
  
  tsconfig.compilerOptions.paths = paths;
  
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  console.log('✅ tsconfig.base.json mis à jour');
}

function updateViteAliasFile() {
  const viteAliasPath = 'packages/config-vite/vite.alias.ts';
  let content = fs.readFileSync(viteAliasPath, 'utf8');
  
  // Générer le contenu des alias
  let aliasContent = `import { fileURLToPath, URL } from "node:url";
import { dirname, resolve } from "node:path";
import type { AliasOptions } from "vite";

// Ce fichier doit être appelé depuis vite.config.ts via import
export function createAppAliases(appRootUrl: string): AliasOptions {
  const appSrc = resolve(fileURLToPath(new URL(appRootUrl, import.meta.url)), "src");

  return [
    {
      find: "@",
      replacement: appSrc,
    },
    {
      find: "@components",
      replacement: resolve(appSrc, "components"),
    },
    {
      find: "@hooks",
      replacement: resolve(appSrc, "hooks"),
    },
    {
      find: "@utils",
      replacement: resolve(appSrc, "utils"),
    },
    // Packages partagés
`;
  
  for (const [alias, targetPath] of Object.entries(ALIASES)) {
    aliasContent += `    {
      find: "${alias}",
      replacement: fileURLToPath(new URL("../${targetPath}", import.meta.url)),
    },
`;
  }
  
  aliasContent += `  ];
}`;
  
  fs.writeFileSync(viteAliasPath, aliasContent);
  console.log('✅ packages/config-vite/vite.alias.ts mis à jour');
}

function updatePackageJsonScripts() {
  const packageJsonPath = 'package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.scripts = {
    ...packageJson.scripts,
    "fix-imports": "node scripts/fix-imports.js",
    "sync-aliases": "node scripts/sync-aliases.js",
    "check-aliases": "node scripts/check-aliases.js",
    "verify-imports": "node scripts/verify-imports.js"
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json scripts mis à jour');
}

function main() {
  console.log('🔄 Synchronisation des alias...\n');
  
  updateTsConfigBase();
  updateViteAliasFile();
  updatePackageJsonScripts();
  
  console.log('\n✅ Synchronisation terminée !');
}

if (require.main === module) {
  main();
}

module.exports = { ALIASES, updateTsConfigBase, updateViteAliasFile }; 