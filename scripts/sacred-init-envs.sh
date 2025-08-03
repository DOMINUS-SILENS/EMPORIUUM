#!/bin/bash

echo "🔮 Génération des fichiers .env sacrés..."

# Acheteur App
mkdir -p apps/acheteur-app
cat <<EOF > apps/acheteur-app/.env
REACT_APP_BACKEND_URL=http://localhost:8000
NODE_ENV=development
EOF
echo "✅ apps/acheteur-app/.env généré"

# Vendeur App
mkdir -p apps/vendeur-app
cat <<EOF > apps/vendeur-app/.env
REACT_APP_BACKEND_URL=http://localhost:8000
NODE_ENV=development
EOF
echo "✅ apps/vendeur-app/.env généré"

# Welcome App
mkdir -p apps/welcome-app
cat <<EOF > apps/welcome-app/.env
NODE_ENV=development
EOF
echo "✅ apps/welcome-app/.env généré"

echo "🧘 Tous les .env sont en place. Tu peux invoquer ./run.sh en toute confiance."
