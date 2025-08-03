#!/usr/bin/env bash

# ================================================
# Script d'unification sacrée pour E-Commerce Monorepo
# ================================================

set -e

echo "🔱 [SOCLE CODEX SACRÉ] Lancement de l’unification sacrée..."

# --- Étape 1 : Vérification de la structure ---
echo "🔍 Vérification de la structure sacrée..."
apps=("acheteur-app" "vendeur-app" "welcome-app" "backend")
packages=("ui-core" "hooks-shared" "utils")

for app in "${apps[@]}"; do
  if [ -d "../apps/$app" ]; then
    echo "✅ apps/$app détecté"
  else
    echo "❌ apps/$app manquant"
  fi
done

for pkg in "${packages[@]}"; do
  if [ -d "../packages/$pkg" ]; then
    echo "✅ packages/$pkg détecté"
  else
    echo "❌ packages/$pkg manquant"
  fi
done

# --- Étape 2 : Installation des dépendances ---
echo "📦 Installation des modules sacrés (pnpm)..."
pnpm install

# --- Étape 3 : Lint global ---
echo "🧹 Linting sacré (monorepo)..."
pnpm lint || echo "⚠️ Certains paquets ont des règles de lint manquantes ou échouées"

# --- Étape 4 : Tests ---
echo "🧪 Tests sacrés (monorepo)..."
pnpm test

# --- Étape 5 : Démarrage des serveurs ---
echo "🚀 Démarrage des serveurs sacrés (dev modes)..."
sleep 3

# Frontends
pnpm workspace @monorepo/achteur dev &
pnpm workspace @monorepo/vendeur dev &
pnpm workspace @monorepo/welcome dev &
# Backend (FastAPI)
docker-compose -f ../docker/backend-compose.yml up --build &

# Affichage des URLs
echo "📡 Tous les serveurs sacrés sont en cours d’activation :"
echo "   🔹 Acheteur   → http://localhost:3000"
echo "   🔹 Vendeur    → http://localhost:3001"
echo "   🔹 Welcome    → http://localhost:3002"
echo "   🔹 Backend    → http://localhost:8000/docs"

echo "⛩️ Appuyez sur Ctrl+C pour interrompre le rituel."

wait
