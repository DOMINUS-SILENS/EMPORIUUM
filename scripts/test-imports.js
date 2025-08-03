#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Tests d'imports à vérifier
const IMPORT_TESTS = [
  {
    name: 'Types import',
    test: `
import { User, Product } from '@types';
console.log('Types import OK');
`,
    expected: 'Types import OK'
  },
  {
    name: 'UI Core import',
    test: `
import { ProductCard } from '@ui-core';
console.log('UI Core import OK');
`,
    expected: 'UI Core import OK'
  },
  {
    name: 'Services import',
    test: `
import { AuthService } from '@services';
console.log('Services import OK');
`,
    expected: 'Services import OK'
  },
  {
    name: 'Hooks import',
    test: `
import { useIsMobile } from '@hooks-shared';
console.log('Hooks import OK');
`,
    expected: 'Hooks import OK'
  },
  {
    name: 'Schemas import',
    test: `
import { UserSchema } from '@schemas';
console.log('Schemas import OK');
`,
    expected: 'Schemas import OK'
  }
];

function createTestFile(testName, testCode) {
  const testDir = path.join(__dirname, 'test-imports');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  const testFile = path.join(testDir, `${testName.replace(/\s+/g, '-').toLowerCase()}.ts`);
  const fullCode = `
// Test: ${testName}
${testCode}
`;
  
  fs.writeFileSync(testFile, fullCode);
  return testFile;
}

function runTypeScriptCheck(filePath) {
  try {
    // Utiliser tsc pour vérifier la résolution
    execSync(`npx tsc --noEmit --skipLibCheck ${filePath}`, {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function runViteCheck(filePath) {
  try {
    // Créer un mini projet Vite pour tester
    const testDir = path.dirname(filePath);
    const viteConfig = path.join(testDir, 'vite.config.ts');
    
    const viteConfigContent = `
import { defineConfig } from 'vite';
import { createAppAliases } from '../../packages/config-vite/vite.alias';

export default defineConfig({
  resolve: {
    alias: createAppAliases(import.meta.url),
  },
});
`;
    
    fs.writeFileSync(viteConfig, viteConfigContent);
    
    // Tester avec Vite
    execSync(`npx vite build --config ${viteConfig}`, {
      stdio: 'pipe',
      cwd: testDir
    });
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function runTest(test) {
  console.log(`🧪 Test: ${test.name}`);
  
  const testFile = createTestFile(test.name, test.test);
  
  // Test TypeScript
  const tsResult = runTypeScriptCheck(testFile);
  if (!tsResult.success) {
    console.log(`❌ TypeScript: ${tsResult.error}`);
    return false;
  }
  console.log('✅ TypeScript: OK');
  
  // Test Vite
  const viteResult = runViteCheck(testFile);
  if (!viteResult.success) {
    console.log(`❌ Vite: ${viteResult.error}`);
    return false;
  }
  console.log('✅ Vite: OK');
  
  return true;
}

function cleanup() {
  const testDir = path.join(__dirname, 'test-imports');
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
}

function main() {
  console.log('🧪 Tests de résolution des imports...\n');
  
  let passed = 0;
  let failed = 0;
  
  // Nettoyer avant de commencer
  cleanup();
  
  for (const test of IMPORT_TESTS) {
    if (runTest(test)) {
      passed++;
    } else {
      failed++;
    }
    console.log('');
  }
  
  // Nettoyer après les tests
  cleanup();
  
  console.log('📊 Résumé des tests:');
  console.log(`✅ Réussis: ${passed}`);
  console.log(`❌ Échoués: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 Tous les tests de résolution sont passés !');
    process.exit(0);
  } else {
    console.log('\n💥 Certains tests ont échoué.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runTest, IMPORT_TESTS }; 