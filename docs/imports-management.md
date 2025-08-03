# Gestion des Imports et Alias - Documentation

## 📋 Vue d'ensemble

Ce système automatisé gère la cohérence des imports dans le monorepo en utilisant des alias absolus au lieu de chemins relatifs.

## 🎯 Objectifs

- ✅ **Cohérence** : Tous les imports vers packages partagés utilisent des alias
- ✅ **Maintenabilité** : Éviter les erreurs de chemins relatifs
- ✅ **Automatisation** : Correction et vérification automatiques
- ✅ **Tests** : Validation de la résolution des imports

## 🛠️ Outils disponibles

### Scripts Turbo

```bash
# Correction automatique des imports
pnpm fix-imports

# Synchronisation des alias
pnpm sync-aliases

# Vérification de la cohérence
pnpm check-aliases

# Vérification des imports
pnpm verify-imports

# Tests de résolution
pnpm test-imports

# Vérification complète
pnpm verify:all
```

### Script Shell

```bash
# Vérification complète
./verify-imports.sh --all

# Correction des imports
./verify-imports.sh --fix

# Vérification des alias
./verify-imports.sh --check

# Synchronisation
./verify-imports.sh --sync

# Test de build
./verify-imports.sh --build
```

## 📁 Structure des alias

### Alias disponibles

| Alias | Chemin | Description |
|-------|--------|-------------|
| `@types` | `packages/types/src` | Types TypeScript |
| `@types-user` | `packages/types-user/src` | Types utilisateur |
| `@shared-types` | `packages/shared-types/src` | Types partagés |
| `@ui-core` | `packages/ui-core/src` | Composants UI de base |
| `@ui` | `packages/ui/src` | Composants UI avancés |
| `@components` | `packages/components` | Composants partagés |
| `@utils` | `packages/utils/src` | Utilitaires |
| `@services` | `packages/services/src` | Services API |
| `@api-client` | `packages/api-client/src` | Client API |
| `@hooks` | `packages/hooks/src` | Hooks React |
| `@hooks-auth` | `packages/hooks-auth/src` | Hooks d'authentification |
| `@hooks-shared` | `packages/hooks-shared/src` | Hooks partagés |
| `@schemas` | `packages/schemas/src` | Schémas Pydantic |
| `@schemas-zod` | `packages/schemas-zod/src` | Schémas Zod |
| `@form-generator` | `packages/form-generator/src` | Générateur de formulaires |
| `@form-configs` | `packages/form-configs/src` | Configurations de formulaires |
| `@config-vite` | `packages/config-vite/src` | Configuration Vite |
| `@config-env` | `packages/config-env/src` | Configuration d'environnement |
| `@py-common` | `packages/py-common/src` | Utilitaires Python |

## 🔧 Configuration

### tsconfig.base.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@types/*": ["packages/types/src/*"],
      "@ui-core/*": ["packages/ui-core/src/*"],
      // ... autres alias
    }
  }
}
```

### vite.config.ts (centralisé)

```typescript
import { createAppAliases } from "../../packages/config-vite/vite.alias";

export default defineConfig({
  resolve: {
    alias: createAppAliases(import.meta.url),
  },
});
```

## 📝 Exemples d'utilisation

### ✅ Imports corrects

```typescript
// Types
import { User, Product } from '@types';

// UI Components
import { ProductCard } from '@ui-core';

// Services
import { AuthService } from '@services';

// Hooks
import { useIsMobile } from '@hooks-shared';

// Schemas
import { UserSchema } from '@schemas';
```

### ❌ Imports incorrects

```typescript
// ❌ Chemins relatifs
import { User } from '../../../packages/types/src/user';

// ❌ Anciens alias
import { User } from '@commercium/types';

// ❌ Chemins directs
import { User } from 'packages/types/src/user';
```

## 🧪 Tests

### Tests d'import unitaires

```bash
pnpm test-imports
```

Les tests vérifient :
- ✅ Résolution TypeScript
- ✅ Résolution Vite
- ✅ Alias valides
- ✅ Imports dynamiques

### Tests de cohérence

```bash
pnpm check-aliases
```

Vérifie :
- ✅ Configuration tsconfig.base.json
- ✅ Configuration vite.config.ts
- ✅ Structure des packages
- ✅ Cohérence des alias

## 🔄 Workflow de développement

### 1. Ajout d'un nouveau package

```bash
# 1. Créer le package
mkdir packages/nouveau-package/src

# 2. Synchroniser les alias
pnpm sync-aliases

# 3. Vérifier la cohérence
pnpm check-aliases
```

### 2. Correction automatique

```bash
# Corriger tous les imports problématiques
pnpm fix-imports

# Ou utiliser le script shell
./verify-imports.sh --fix
```

### 3. Vérification continue

```bash
# Vérification complète
pnpm verify:all

# Ou intégré dans CI
./verify-imports.sh --all
```

## 🚨 ESLint Rules

### Configuration personnalisée

```javascript
// packages/eslint-config-imports/index.js
module.exports = {
  plugins: ['import'],
  rules: {
    'import/no-relative-parent-imports': 'error',
    'import/no-relative-packages': 'error',
    'import/valid-namespace': 'error',
    'import/no-cycle': 'error',
    // ...
  }
};
```

### Intégration dans les apps

```javascript
// eslint.config.js
module.exports = {
  extends: [
    '@monorepo/eslint-config-imports'
  ]
};
```

## 🔗 Imports dynamiques

### Avec form-configs

```typescript
import { importSchema, validateWithSchema } from '@form-configs';

// Import dynamique
const UserSchema = await importSchema('@schemas', 'User');

// Validation dynamique
const user = await validateWithSchema('@schemas', 'User', data);
```

## 📊 Monitoring

### Rapports de vérification

```bash
pnpm verify-imports
```

Génère un rapport détaillé :
- 📁 Fichiers avec problèmes
- 🔴 Types de problèmes
- 💡 Suggestions de correction
- 📈 Statistiques

### Intégration CI/CD

```yaml
# .github/workflows/verify-imports.yml
- name: Verify Imports
  run: |
    pnpm verify:all
    pnpm test-imports
```

## 🆘 Dépannage

### Problèmes courants

1. **Alias non reconnu**
   ```bash
   pnpm sync-aliases
   ```

2. **Imports relatifs détectés**
   ```bash
   pnpm fix-imports
   ```

3. **Résolution TypeScript échoue**
   ```bash
   pnpm check-aliases
   ```

4. **Build échoue**
   ```bash
   ./verify-imports.sh --build
   ```

### Logs et debugging

```bash
# Mode verbose
DEBUG=imports pnpm verify-imports

# Logs détaillés
pnpm check-aliases --verbose
```

## 📚 Références

- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Vite Alias Configuration](https://vitejs.dev/config/shared-options.html#resolve-alias)
- [ESLint Import Plugin](https://github.com/import-js/eslint-plugin-import)
- [Turbo Build System](https://turbo.build/repo/docs) 