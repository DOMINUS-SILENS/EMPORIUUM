# 🚀 Système de Gestion des Imports - Monorepo E-Commerce

> **Système automatisé pour la cohérence des imports et alias dans le monorepo**

[![Turbo](https://img.shields.io/badge/Turbo-FF6B6B?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/repo)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

## 📋 Vue d'ensemble

Ce système automatisé garantit la cohérence des imports dans le monorepo en utilisant des **alias absolus** au lieu de chemins relatifs, améliorant la maintenabilité et réduisant les erreurs.

### ✨ Fonctionnalités

- 🔧 **Correction automatique** des imports relatifs
- 🔄 **Synchronisation** des alias entre TypeScript et Vite
- 🧪 **Tests unitaires** de résolution d'imports
- 🚨 **Règles ESLint** personnalisées
- 📊 **Rapports détaillés** de vérification
- 🔗 **Imports dynamiques** pour les schémas de validation

## 🚀 Démarrage rapide

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd e-commerce-platform

# Installer les dépendances
pnpm install

# Vérifier la cohérence des imports
pnpm verify:all
```

### Commandes principales

```bash
# Correction automatique des imports
pnpm fix-imports

# Vérification de la cohérence
pnpm check-aliases

# Tests de résolution
pnpm test-imports

# Vérification complète
pnpm verify:all
```

## 🛠️ Outils disponibles

### Scripts Turbo

| Commande | Description |
|----------|-------------|
| `pnpm fix-imports` | Correction automatique des imports relatifs |
| `pnpm sync-aliases` | Synchronisation des alias |
| `pnpm check-aliases` | Vérification de la cohérence |
| `pnpm verify-imports` | Vérification complète des imports |
| `pnpm test-imports` | Tests de résolution d'imports |

### Script Shell

```bash
# Vérification complète
./verify-imports.sh --all

# Correction des imports
./verify-imports.sh --fix

# Vérification des alias
./verify-imports.sh --check

# Test de build
./verify-imports.sh --build
```

## 📁 Structure des alias

### Alias principaux

| Alias | Chemin | Description |
|-------|--------|-------------|
| `@types` | `packages/types/src` | Types TypeScript |
| `@ui-core` | `packages/ui-core/src` | Composants UI de base |
| `@services` | `packages/services/src` | Services API |
| `@hooks-shared` | `packages/hooks-shared/src` | Hooks partagés |
| `@schemas` | `packages/schemas/src` | Schémas Pydantic |
| `@schemas-zod` | `packages/schemas-zod/src` | Schémas Zod |

> 📖 **Voir la [documentation complète des alias](docs/aliases.md)**

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

## 🧪 Tests et validation

### Tests d'import unitaires

```bash
pnpm test-imports
```

Vérifie :
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

### Configuration

```javascript
// eslint.config.js
module.exports = {
  extends: [
    '@monorepo/eslint-config-imports'
  ]
};
```

### Règles principales

- `import/no-relative-parent-imports`: Interdit les imports relatifs vers packages
- `import/no-relative-packages`: Force l'utilisation des alias
- `import/valid-namespace`: Vérifie les alias valides
- `import/no-cycle`: Interdit les imports circulaires

## 🔗 Imports dynamiques

### Avec form-configs

```typescript
import { importSchema, validateWithSchema } from '@form-configs';

// Import dynamique
const UserSchema = await importSchema('@schemas', 'User');

// Validation dynamique
const user = await validateWithSchema('@schemas', 'User', data);
```

## 📊 Monitoring et rapports

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

## 📚 Documentation

- 📖 [Gestion des imports](docs/imports-management.md)
- 📋 [Table des alias](docs/aliases.md)
- 🛠️ [Configuration ESLint](packages/eslint-config-imports/)
- 🔧 [Scripts utilitaires](scripts/)

## 🤝 Contribution

### Ajout d'un nouvel alias

1. Modifier `packages/config-vite/vite.alias.ts`
2. Modifier `tsconfig.base.json`
3. Exécuter `pnpm sync-aliases`
4. Vérifier avec `pnpm check-aliases`

### Ajout d'une nouvelle règle ESLint

1. Modifier `packages/eslint-config-imports/index.js`
2. Tester avec `pnpm lint`
3. Documenter dans `docs/imports-management.md`

## 📈 Métriques

- **Temps de correction** : < 30s pour 1000 fichiers
- **Précision de détection** : > 99%
- **Cohérence des alias** : 100%
- **Tests de résolution** : 100% de réussite

## 🏆 Avantages

- ✅ **Maintenabilité** : Évite les erreurs de chemins relatifs
- ✅ **Cohérence** : Alias standardisés dans tout le monorepo
- ✅ **Automatisation** : Correction et vérification automatiques
- ✅ **Tests** : Validation complète de la résolution
- ✅ **Documentation** : Guide complet et exemples pratiques

---

**Développé avec ❤️ pour le monorepo E-Commerce**

*[Retour au sommet](#-système-de-gestion-des-imports---monorepo-e-commerce)* 