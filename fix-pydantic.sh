#!/bin/bash

echo "🔧 Réparation sacrée des dépendances Pydantic..."

REQ_FILE="./apps/backend/requirements.txt"

echo "📄 Écriture du nouveau requirements.txt compatible Pydantic v1.x..."
cat > "$REQ_FILE" <<EOF
fastapi
uvicorn[standard]
pydantic<2.0
python-dotenv
EOF

echo "✅ requirements.txt mis à jour :"
cat "$REQ_FILE"

echo "🐳 Reconstruction du backend Docker..."
docker-compose build backend

echo "🚀 Redémarrage des services..."
docker-compose up -d

echo "🌟 Réparation terminée. Ton backend est désormais compatible Pydantic 1.x."
