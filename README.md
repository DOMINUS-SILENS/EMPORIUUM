# E-Commerce Platform

A modern, microservice-based e-commerce platform with separate frontend applications for buyers and sellers.

## Overview

This platform is built with a microservices architecture, featuring:

- **welcome-app**: Authentication gateway and entry point
- **vendeur-app**: Seller dashboard and management interface
- **achteur-app**: Buyer interface for browsing and purchasing
- **backend**: FastAPI-based backend with JWT authentication

## Features

- **Role-Based Access Control**
  - Separate interfaces for buyers and sellers
  - Protected routes based on user roles
  - Secure JWT authentication

- **Seller Features**
  - Product management (CRUD operations)
  - Sales tracking
  - Inventory management

- **Buyer Features**
  - Browse products
  - Add to cart
  - Secure checkout

## Getting Started

For detailed setup instructions, see the [Quick Start Guide](./QUICK_START.md).

### Prerequisites

- Node.js (v16+)
- Python (3.8+)
- PostgreSQL
- npm or yarn

### Quick Start

1. Clone the repository
2. Set up the backend (see [Backend Setup](#backend-setup))
3. Set up the frontend apps (see [Frontend Setup](#frontend-setup))
4. Start the development servers

## Documentation

- [Integration Guide](./INTEGRATION_GUIDE.md) - Detailed architecture and integration documentation
- [API Documentation](http://localhost:8000/docs) - Interactive API documentation (when backend is running)
- [Quick Start Guide](./QUICK_START.md) - Get up and running quickly

### Coding Conventions & Shared Modules

- **Aliases** :
  - `@shared/*` → `../../shared/*` (TypeScript/tsconfig), `../../shared` (Vite)
  - `@` → `./src/*` (TypeScript/tsconfig), `./src` (Vite)
- **Tous les modules partagés** (types, hooks, contextes, services) sont dans le dossier `shared/` et importés via `@shared`.
- **Factorisation** :
  - AuthContext, useAuth, authService, schémas Zod, types utilisateurs sont centralisés dans `shared/`.
  - Ne pas dupliquer ces fichiers dans chaque app, importer uniquement.

### JWT Authentication

- **Backend** :
  - Utilise FastAPI avec JWT (Bearer) pour l’authentification.
  - Les endpoints `/auth/login`, `/auth/register`, `/auth/me` gèrent l’auth de base.
  - Le JWT contient : `sub` (user id), `role` ("vendeur", "acheteur", "admin"), `exp` (expiration).
- **Frontend** :
  - Les apps utilisent le service partagé `authService` pour login/register/logout.
  - Le token JWT est stocké dans `localStorage` sous `access_token`.
  - La redirection post-login se fait selon le rôle (`/vendeur-app`, `/achteur-app`).
  - Les hooks et contextes d’auth sont factorisés dans `shared/contexts/AuthContext.tsx`.

### Shared Code Structure

- `shared/types/` : types TypeScript et schémas Zod (validation frontend)
- `shared/services/` : services d’auth, API, etc.
- `shared/contexts/` : contextes React partagés (auth, user, etc.)
- `shared/hooks/` : hooks réutilisables (à factoriser au besoin)

### Contribution & Maintenabilité

- **Toujours factoriser dans `shared/` ce qui est commun à plusieurs apps**.
- **Respecter les conventions de nommage et de typage** (`full_name`, rôles en français, etc.).
- **Tenir à jour cette documentation lors de toute évolution majeure de l’architecture.**

## Project Structure

```
.
├── apps/                    # Frontend applications
│   ├── welcome-app/         # Authentication and entry point
│   ├── vendeur-app/         # Seller interface
│   └── achteur-app/         # Buyer interface
├── backend/                 # FastAPI backend
│   ├── src/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core functionality
│   │   ├── db/             # Database models and migrations
│   │   └── services/       # Business logic
│   └── requirements.txt    # Python dependencies
└── shared/                 # Shared code between frontend apps
```

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. Initialize the database:
   ```bash
   python -m src.db.create_tables
   ```

6. Start the backend server:
   ```bash
   uvicorn src.main:app --reload
   ```

## Frontend Setup

### Welcome App (Port 3000)

```bash
cd apps/welcome-app
npm install
npm run dev
```

### Vendeur App (Port 3001)

```bash
cd apps/vendeur-app
npm install
npm run dev -- --port 3001
```

### Acheteur App (Port 3002)

```bash
cd apps/achteur-app
npm install
npm run dev -- --port 3002
```

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

Run tests for each frontend app:

```bash
cd apps/<app-name>
npm test
```

## Deployment

For production deployment, refer to the [Deployment Section](./INTEGRATION_GUIDE.md#deployment) in the Integration Guide.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: [https://github.com/yourusername/ecommerce-platform](https://github.com/yourusername/ecommerce-platform)
