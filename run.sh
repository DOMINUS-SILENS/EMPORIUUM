#!/bin/bash

echo "🔱 [SOCLE CODEX SACRÉ] Lancement sacré des applications..."

# 🧼 Nettoyage des conteneurs précédents (optionnel mais recommandé)
echo "🧹 Arrêt et suppression des conteneurs existants..."
docker-compose down

# 🔄 Rebuild total
echo "🔧 Re-construction des services Docker..."
docker-compose build --no-cache

# 🚀 Lancement des services
echo "🚀 Démarrage des applications COMMERCIUM / EMPORIUM..."
docker-compose up -d

# 📡 Vérification des services lancés
echo "🔍 Vérification des conteneurs actifs..."
docker ps

# 🌐 Affichage des URLs d'accès
echo ""
echo "🌐 Accès aux apps :"
echo "👉 Backend API       : http://localhost:8000/docs"
echo "👉 Vendeur App       : http://localhost:3001"
echo "👉 Acheteur App      : http://localhost:3000"
echo "👉 Welcome App       : http://localhost:3002"

echo ""
echo "✅ Tout est en place. Codex Sacré opérationnel."
