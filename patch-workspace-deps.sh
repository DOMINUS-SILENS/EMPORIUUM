#!/bin/bash

echo "🔗 [sacred-link] Initialisation des liens sacrés PNPM..."

pnpm install --no-frozen-lockfile

echo "🔍 [sacred-link] Recherche des packages locaux en mode workspace:*..."

# Fonction pour extraire les dépendances locales erronées
repair_workspace_links() {
  echo "🔄 [sacred-link] Réparation des dépendances locales..."

  # Parcourt tous les packages du workspace
  for pkg_json in $(find . -name package.json | grep -v "node_modules"); do
    dir=$(dirname "$pkg_json")
    echo "📦 Inspection: $dir"

    # Utilise jq si disponible pour manipuler les dépendances
    if command -v jq &> /dev/null; then
      dependencies=$(jq -r '
        .dependencies // {} | to_entries[] |
        select(.value | test("^workspace:")) |
        .key
      ' "$pkg_json")

      for dep in $dependencies; do
        target_path=$(pnpm list "$dep" --depth 0 --json | jq -r '.[0].path')
        if [[ ! -d "$target_path" ]]; then
          echo "⚠️  $dep introuvable. Tentative de correction..."
          sed -i "s/\"$dep\": \"workspace:[^\"]*\"/\"$dep\": \"*\"/" "$pkg_json"
        fi
      done
    else
      echo "⚠️ jq n’est pas installé. Réparation manuelle impossible."
    fi
  done
}

# Réparation des liens locaux cassés
repair_workspace_links

echo "📦 [sacred-link] Réinstallation avec liens corrigés..."
pnpm install --no-frozen-lockfile

echo "✅ [sacred-link] Liens sacrés établis."
