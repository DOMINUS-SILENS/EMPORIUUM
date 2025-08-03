# 🤖 Instructions Copilot

## 🎯 Objectif

Ces instructions guident GitHub Copilot dans la maintenance et l'évolution du code selon nos standards sacrés.

## 📋 Règles Générales

### 1. Architecture

- Respecter la structure monorepo
- Utiliser les packages partagés (`packages/*`)
- Éviter la duplication de code

### 2. Typage

- Utiliser TypeScript strict
- Synchroniser avec les modèles Pydantic
- Valider avec Zod

### 3. Composants

- Favoriser les composants réutilisables
- Utiliser les hooks partagés
- Maintenir la cohérence UI

### 4. Tests

- Maintenir la couverture > 80%
- Tester les cas limites
- Documenter les scénarios

## 🔍 Patterns à Suivre

### Services API

```typescript
// ✅ Bon Pattern
import { api } from "@packages/services";
import { type User } from "@packages/types";

export const userService = {
  async getUser(id: string): Promise<User> {
    return api.get(`/users/${id}`);
  },
};
```

### Hooks Partagés

```typescript
// ✅ Bon Pattern
import { useAuth } from "@packages/hooks-auth";
import { useToast } from "@packages/hooks-shared";

export const useProtectedAction = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  // ...
};
```

### Composants UI

```typescript
// ✅ Bon Pattern
import { Button, Card } from "@packages/ui-core";
import { type Product } from "@packages/types";

interface ProductCardProps {
  product: Product;
  onAdd: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return <Card>{/* ... */}</Card>;
};
```

## 🚫 Anti-Patterns à Éviter

```typescript
// ❌ Mauvais Pattern - Duplication de types
interface User {  // Devrait venir de @packages/types
  id: string;
  name: string;
}

// ❌ Mauvais Pattern - Appel API direct
fetch('/api/users').then(/* ... */);  // Utiliser @packages/services

// ❌ Mauvais Pattern - Style en ligne
<div style={{ margin: '20px' }}>  // Utiliser @packages/ui-core
```

## 🏗️ Génération de Code

### Modèles

- Utiliser les templates existants
- Générer via scripts officiels
- Valider la sortie

### Documentation

- Commenter les fonctions publiques
- Expliquer les choix complexes
- Maintenir les README

## 🔐 Sécurité

### Authentication

```typescript
// ✅ Bon Pattern
import { useAuth } from "@packages/hooks-auth";
import { type Role } from "@packages/types";

export const ProtectedRoute: React.FC = ({ children }) => {
  const { isAuthenticated, hasRole } = useAuth();
  // ...
};
```

### Validation

```typescript
// ✅ Bon Pattern
import { userSchema } from "@packages/schemas-zod";
import { type UserInput } from "@packages/types";

export const validateUser = (input: UserInput) => {
  return userSchema.parse(input);
};
```

## 📝 Tests

### Unit Tests

```typescript
// ✅ Bon Pattern
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./ProductCard";

describe("ProductCard", () => {
  it("should display product information", () => {
    // ...
  });
});
```

### Integration Tests

```typescript
// ✅ Bon Pattern
import { setupServer } from "msw/node";
import { api } from "@packages/services";

const server = setupServer(/* ... */);

describe("API Integration", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  // ...
});
```

## 🔄 CI/CD

### Scripts

- Utiliser `sacred-build.sh`
- Vérifier les rapports
- Suivre les métriques

### Déploiement

- Respecter les environnements
- Valider les variables
- Vérifier les containers
