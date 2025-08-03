#!/bin/bash

echo "🔱 [SOCLE CODEX SACRÉ] Lancement global..."

# ─── Étape 1 : Vérifier les ports utilisés ───────────────────────────────
if lsof -i :5432 >/dev/null; then
  echo "⚠️  Port 5432 déjà utilisé. Un autre service Postgres tourne ?"
  read -p "⏸️  Appuyer sur [Entrée] pour tuer le processus ou [Ctrl+C] pour annuler..."
  PID=$(lsof -ti:5432)
  kill -9 $PID
  echo "✅ Processus $PID tué."
fi

# ─── Étape 2 : Nettoyage ────────────────────────────────────────────────
echo "🧹 Nettoyage Docker..."
docker-compose down --volumes --remove-orphans
docker system prune -f

# ─── Étape 3 : Rebuild complet ──────────────────────────────────────────
echo "🔨 Rebuild des conteneurs..."
docker-compose build --no-cache

# ─── Étape 4 : Démarrage ────────────────────────────────────────────────
echo "🚀 Lancement des services..."
docker-compose up -d

# ─── Étape 5 : Vérification ─────────────────────────────────────────────
echo "🔍 Vérification des conteneurs actifs..."
docker ps

# ─── Étape 6 : Journalisation optionnelle ───────────────────────────────
read -p "📖 Afficher les logs en temps réel ? (o/n): " answer
if [[ "$answer" == "o" ]]; then
  docker-compose logs -f
else
  echo "🕊️ Lancement terminé sans affichage des logs."
fi
