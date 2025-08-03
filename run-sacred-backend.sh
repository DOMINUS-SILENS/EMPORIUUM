#!/bin/bash

echo "🔱 [SOCLE SACRÉ] Initialisation de l'environnement Docker..."

# Configuration
DOCKER_COMPOSE_FILE="docker-compose.yml"
DEFAULT_DB_PORT=5432
ALTERNATE_DB_PORT=5433
PROJECT_NAME="e-commerceplatforme"

# Vérifie si le port 5432 est déjà utilisé
if lsof -i:$DEFAULT_DB_PORT &>/dev/null; then
    echo "⚠️  Port $DEFAULT_DB_PORT déjà utilisé. Utilisation du port alternatif $ALTERNATE_DB_PORT..."
    export DB_PORT=$ALTERNATE_DB_PORT
else
    echo "✅ Port $DEFAULT_DB_PORT libre. Utilisation par défaut."
    export DB_PORT=$DEFAULT_DB_PORT
fi

# Nettoyage éventuel (containers anciens)
echo "🧹 Nettoyage des anciens containers..."
docker-compose -p $PROJECT_NAME down

# Build et lancement
echo "🚀 Lancement de l’environnement sacré [$PROJECT_NAME]..."
docker-compose -p $PROJECT_NAME up --build -d

# Affichage des logs backend
echo "📜 Logs en direct du backend (FastAPI)..."
docker-compose logs -f backend
