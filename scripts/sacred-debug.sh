#!/bin/bash

echo "🔱 [SOCLE CODEX SACRÉ] Lancement de l’unification sacrée..."

ROOT_DIR=$(dirname "$(dirname "$(realpath "$0")")")
cd "$ROOT_DIR" || exit 1

# === 1. Vérification des prérequis ===
echo "🔍 Vérification de la structure sacrée..."
for dir in apps/acheteur-app apps/vendeur-app apps/welcome-app apps/backend packages/ui-core; do
  if [ -d "$dir" ]; then
    echo "✅ $dir détecté"
  else
    echo "❌ $dir manquant ! Arrêt du rituel."
    exit 1
  fi
done

# === 2. Synchronisation des types ===
echo "🔄 Synchronisation des types sacrés..."
if [ -f ./scripts/sync-types.sh ]; then
  bash ./scripts/sync-types.sh
else
  echo "⚠️ Aucun script de synchronisation détecté (scripts/sync-types.sh)"
fi

# === 3. Linting des apps ===
echo "🧹 Linting sacré..."
pnpm lint || echo "⚠️ Lint échoué – vérifie ton karma syntaxique"

# === 4. Tests unitaires ===
echo "🧪 Tests sacrés..."
pnpm test || echo "⚠️ Certains tests ont échoué – la sagesse vacille"

# === 5. Lancement des serveurs en parallèle ===
echo "🚀 Démarrage des serveurs sacrés..."
pnpm --filter "acheteur-app" dev &
pid1=$!
pnpm --filter "vendeur-app" dev &
pid2=$!
pnpm --filter "welcome-app" dev &
pid3=$!
pnpm --filter "backend" dev &
pid4=$!

echo "⏳ Attente de stabilisation énergétique (5s)..."
sleep 5

echo "📡 Tous les serveurs sacrés sont en cours d’activation :"
echo "   🔹 Acheteur   → http://localhost:3000"
echo "   🔹 Vendeur    → http://localhost:3001"
echo "   🔹 Welcome    → http://localhost:3002"
echo "   🔹 Backend    → http://localhost:8000/docs"

# === 6. Wait until user kills ===
echo "⛩️ Appuyez sur Ctrl+C pour interrompre le rituel."
wait $pid1 $pid2 $pid3 $pid4

echo "🙏 Rituel sacré terminé."
