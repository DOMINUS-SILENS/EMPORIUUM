#!/bin/bash
set -e

echo "==> Build & start all services (detached mode)..."
docker-compose up --build -d

echo "==> Attendre le démarrage du backend..."
sleep 10

echo "==> Appliquer les migrations (si applicable)..."
docker-compose exec backend alembic upgrade head || echo "Pas de migrations à appliquer"

echo "==> Provisionner des comptes de test (API backend)..."
curl -X POST http://localhost:8000/auth/register -H "Content-Type: application/json" -d '{"email":"vendeur@example.com","password":"vendeur123","full_name":"Test Vendeur","role":"vendeur"}' || true
curl -X POST http://localhost:8000/auth/register -H "Content-Type: application/json" -d '{"email":"acheteur@example.com","password":"acheteur123","full_name":"Test Acheteur","role":"acheteur"}' || true

echo "==> Vérification des services..."
curl -f http://localhost:3000 || echo "welcome-app KO"
curl -f http://localhost:3001 || echo "vendeur-app KO"
curl -f http://localhost:3002 || echo "achteur-app KO"
curl -f http://localhost:8000/docs || echo "backend KO"

echo "==> Provisioning terminé !"
