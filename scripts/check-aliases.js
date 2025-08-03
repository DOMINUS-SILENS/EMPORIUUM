#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration des alias attendus (seulement ceux qui existent)
const EXPECTED_ALIASES = {
  '@types': 'packages/types/src',
  '@types-user': 'packages/types-user/src',
  '@shared-types': 'packages/shared-types/src',
  '@ui-core': 'packages/ui-core/src',
  '@components': 'packages/components',
  '@utils': 'packages/utils/src',
  '@services': 'packages/services/src',
  '@api-client': 'packages/api-client/src',
  '@hooks-auth': 'packages/hooks-auth/src',
  '@hooks-shared': 'packages/hooks-shared/src',
  '@schemas': 'packages/schemas/src',
  '@schemas-zod': 'packages/schemas-zod/src',
  '@form-generator': 'packages/form-generator/src',
  '@form-configs': 'packages/form-configs/src',
  '@config-env': 'packages/config-env/src'
};

function checkTsConfigBase() {
  console.log('🔍 Vérification de tsconfig.base.json...');
  
  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.base.json', 'utf8'));
    const paths = tsconfig.compilerOptions?.paths || {};
    
    let issues = 0;
    
    for (const [alias, expectedPath] of Object.entries(EXPECTED_ALIASES)) {
      const expectedKey = `${alias}/*`;
      const actualPath = paths[expectedKey];
      
      if (!actualPath) {
        console.log(`❌ Alias manquant: ${expectedKey}`);
        issues++;
      } else if (actualPath[0] !== `${expectedPath}/*`) {
        console.log(`❌ Alias incorrect: ${expectedKey} → ${actualPath[0]} (attendu: ${expectedPath}/*)`);
        issues++;
      }
    }
    
    if (issues === 0) {
      console.log('✅ tsconfig.base.json cohérent');
    }
    
    return issues;
  } catch (error) {
    console.log('❌ Erreur lors de la lecture de tsconfig.base.json:', error.message);
    return 1;
  }
}

function checkViteConfigs() {
  console.log('\n🔍 Vérification des vite.config.ts...');
  
  const appConfigs = glob.sync('apps/*/vite.config.ts');
  let issues = 0;
  
  for (const configPath of appConfigs) {
    try {
      const content = fs.readFileSync(configPath, 'utf8');
      
      if (!content.includes('createAppAliases')) {
        console.log(`❌ ${configPath}: n'utilise pas createAppAliases`);
        issues++;
      } else {
        console.log(`✅ ${configPath}: utilise createAppAliases`);
      }
    } catch (error) {
      console.log(`❌ Erreur lors de la lecture de ${configPath}:`, error.message);
      issues++;
    }
  }
  
  return issues;
}

function checkViteAliasFile() {
  console.log('\n🔍 Vérification de packages/config-vite/vite.alias.ts...');
  
  try {
    const content = fs.readFileSync('packages/config-vite/vite.alias.ts', 'utf8');
    
    let issues = 0;
    
    for (const [alias, expectedPath] of Object.entries(EXPECTED_ALIASES)) {
      const expectedPattern = `find: "${alias}"`;
      if (!content.includes(expectedPattern)) {
        console.log(`❌ Alias manquant dans vite.alias.ts: ${alias}`);
        issues++;
      }
    }
    
    if (issues === 0) {
      console.log('✅ vite.alias.ts cohérent');
    }
    
    return issues;
  } catch (error) {
    console.log('❌ Erreur lors de la lecture de vite.alias.ts:', error.message);
    return 1;
  }
}

function checkPackageStructure() {
  console.log('\n🔍 Vérification de la structure des packages...');
  
  let issues = 0;
  
  for (const [alias, expectedPath] of Object.entries(EXPECTED_ALIASES)) {
    if (!fs.existsSync(expectedPath)) {
      console.log(`❌ Package manquant: ${expectedPath} (alias: ${alias})`);
      issues++;
    }
  }
  
  if (issues === 0) {
    console.log('✅ Structure des packages cohérente');
  }
  
  return issues;
}

function main() {
  console.log('🔍 Vérification de la cohérence des alias...\n');
  
  const tsIssues = checkTsConfigBase();
  const viteIssues = checkViteConfigs();
  const aliasIssues = checkViteAliasFile();
  const structureIssues = checkPackageStructure();
  
  const totalIssues = tsIssues + viteIssues + aliasIssues + structureIssues;
  
  console.log(`\n📊 Résumé:`);
  console.log(`- tsconfig.base.json: ${tsIssues} problème(s)`);
  console.log(`- vite.config.ts: ${viteIssues} problème(s)`);
  console.log(`- vite.alias.ts: ${aliasIssues} problème(s)`);
  console.log(`- Structure packages: ${structureIssues} problème(s)`);
  console.log(`- Total: ${totalIssues} problème(s)`);
  
  if (totalIssues === 0) {
    console.log('\n✅ Tous les alias sont cohérents !');
    process.exit(0);
  } else {
    console.log('\n❌ Des problèmes de cohérence ont été détectés.');
    console.log('💡 Exécutez "pnpm sync-aliases" pour corriger automatiquement.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkTsConfigBase, checkViteConfigs, checkViteAliasFile, checkPackageStructure }; 