const noRelativeParentImports = require('./rules/no-relative-parent-imports');
const validNamespace = require('./rules/valid-namespace');

module.exports = {
  plugins: ['import'],
  rules: {
    // Règles personnalisées
    'import/no-relative-parent-imports': ['error', {
      packages: ['packages'],
      aliases: {
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
      }
    }],
    
    'import/valid-namespace': ['error', {
      validAliases: [
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
      ]
    }],
    
    // Règles ESLint import standard
    'import/no-unresolved': 'off', // Désactivé car géré par TypeScript
    
    // Interdire les imports circulaires
    'import/no-cycle': 'error',
    
    // Forcer l'ordre des imports
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    
    // Interdire les imports multiples sur une ligne
    'import/no-duplicates': 'error',
    
    // Forcer les extensions pour les imports relatifs
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    
    // Préférer les imports nommés
    'import/prefer-default-export': 'off',
    
    // Interdire les imports par défaut
    'import/no-default-export': 'off',
    
    // Vérifier les exports
    'import/exports-last': 'error',
    
    // Interdire les imports inutilisés
    'import/no-unused-modules': 'error',
    
    // Forcer les imports absolus pour les modules internes
    'import/no-relative-parent-imports': 'error'
  },
  
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    },
    
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    }
  }
}; 