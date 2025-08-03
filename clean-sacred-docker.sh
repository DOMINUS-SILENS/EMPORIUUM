#!/bin/bash

echo "🧼 Nettoyage sacré complet de Docker pour le backend..."

echo "🛑 Arrêt des conteneurs..."
docker-compose down --volumes --remove-orphans

echo "🔥 Suppression des anciennes images..."
docker rmi e-commerceplatforme_backend || true

echo "🧽 Suppression des volumes non utilisés..."
docker volume prune -f

echo "🧱 Reconstruction du projet..."
docker-compose build

echo "🚀 Relancement du projet..."
docker-compose up -d

echo "✅ Nettoyage terminé. Tu peux vérifier avec : docker ps -a"
