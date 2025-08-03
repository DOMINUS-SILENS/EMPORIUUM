#!/bin/bash

echo "🔱 [SOCLE CODEX SACRÉ] - Initialisation sacrée du backend EMPORIUM..."

BACKEND_DIR="./apps/backend"
REQUIREMENTS_FILE="$BACKEND_DIR/requirements.txt"

echo "🧹 Purification des anciens artefacts Docker..."
docker-compose down --volumes --remove-orphans
docker image rm emp-backend:latest -f 2>/dev/null
docker volume prune -f

echo "🧠 Régénération sacrée du requirements.txt (version safe de Pydantic 1.x)..."
cat > "$REQUIREMENTS_FILE" <<EOF
fastapi
uvicorn[standard]
pydantic==1.10.22
sqlalchemy
psycopg2-binary
python-dotenv
EOF

echo "🧱 Reconstruction du backend..."
docker-compose build backend

echo "🚀 Lancement sacré du backend + PostgreSQL..."
docker-compose up -d

echo "⏳ Patience... Synchronisation vibratoire en cours..."
sleep 5

echo "🔍 Vérification des conteneurs actifs :"
docker ps --filter name=emp-

echo "📜 Logs récents :"
docker-compose logs --tail=20 backend

echo "🌐 Ouverture de l'API FastAPI dans ton navigateur..."
xdg-open http://localhost:8000/docs 2>/dev/null || open http://localhost:8000/docs || echo "🔗 Ouvre manuellement http://localhost:8000/docs"

echo "✅ [TERMINÉ] Backend sacré EMPORIUM opérationnel."

