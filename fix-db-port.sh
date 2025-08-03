#!/bin/bash

echo "🔍 Vérification du port 5432..."

PID=$(lsof -t -i:5432)

if [ -n "$PID" ]; then
  echo "⚠️  Port 5432 est déjà utilisé par le PID: $PID"
  echo "🔎 Processus en cours:"
  lsof -i :5432
  echo
  read -p "❓ Voulez-vous tuer ce processus ? [y/N] " choice
  if [[ "$choice" == [yY] ]]; then
    echo "🗡️  Suppression du processus $PID..."
    kill -9 "$PID"
    echo "✅ Processus tué."
  else
    echo "⛔ Annulation. Libérez manuellement le port puis relancez le script."
    exit 1
  fi
else
  echo "✅ Aucun processus n'utilise le port 5432."
fi

echo
echo "🚀 Relancement de Docker Compose..."
docker-compose up --build
