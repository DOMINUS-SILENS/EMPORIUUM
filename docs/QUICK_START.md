# E-Commerce Platform - Quick Start

This guide will help you get the E-Commerce Platform up and running quickly for development.

## Prerequisites

- Node.js (v16+)
- Python (3.8+)
- PostgreSQL
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecommerce-platform
```

### 2. Set Up the Backend

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
   The API will be available at `http://localhost:8000`

### 3. Set Up the Frontend

Open a new terminal for each frontend app:

1. **welcome-app** (Port 3000):
   ```bash
   cd apps/welcome-app
   npm install
   npm run dev
   ```

2. **vendeur-app** (Port 3001):
   ```bash
   cd apps/vendeur-app
   npm install
   npm run dev -- --port 3001
   ```

3. **achteur-app** (Port 3002):
   ```bash
   cd apps/achteur-app
   npm install
   npm run dev -- --port 3002
   ```

### 4. Access the Applications

- **Welcome App**: http://localhost:3000
- **Vendeur App**: http://localhost:3001
- **Achteur App**: http://localhost:3002
- **API Documentation**: http://localhost:8000/docs

## Testing the Integration

1. Register a new account at http://localhost:3000/register
2. Select a role (vendeur or acheteur)
3. You will be automatically redirected to the appropriate app
4. Log out and try logging in with your new credentials

## Development Scripts

### Backend

- Run tests: `pytest`
- Format code: `black .`
- Lint code: `flake8`

### Frontend (for each app)

- Format code: `npm run format`
- Lint code: `npm run lint`
- Run tests: `npm test`

## Need Help?

Refer to the full [Integration Guide](./INTEGRATION_GUIDE.md) for detailed documentation.
