#!/bin/bash

echo "🧱 Initialisation du backend sacré dans Docker..."

# Créer la structure
mkdir -p apps/backend/app/{core,models,routes,schemas,services}
mkdir -p docker/backend

# Créer Dockerfile
cat <<'EOF' > apps/backend/Dockerfile
FROM python:3.11-slim

RUN apt-get update && apt-get install -y build-essential libpq-dev curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
EOF

# Créer requirements.txt
cat <<EOF > apps/backend/requirements.txt
fastapi
uvicorn[standard]
pydantic
sqlmodel
asyncpg
python-dotenv
EOF

# Créer .env
cat <<EOF > docker/backend/dev.env
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=emporium
POSTGRES_USER=emporium_user
POSTGRES_PASSWORD=emporium_pass
EOF

# Créer docker-compose.yml (à la racine)
cat <<'EOF' > docker-compose.yml
version: '3.9'

services:
  backend:
    build:
      context: ./apps/backend
    container_name: emp-backend
    volumes:
      - ./apps/backend/app:/app/app
    env_file:
      - ./docker/backend/dev.env
    ports:
      - "8000:8000"
    depends_on:
      - db

  db:
    image: postgres:15
    container_name: emp-db
    restart: always
    environment:
      POSTGRES_DB: emporium
      POSTGRES_USER: emporium_user
      POSTGRES_PASSWORD: emporium_pass
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pgdata:
EOF

# Créer main.py
cat <<'EOF' > apps/backend/app/main.py
from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(title="EMPORIUM Backend")

@app.get("/")
def read_root():
    return {"message": "Bienvenue dans le backend sacré d’EMPORIUM"}
EOF

# Créer config.py
cat <<'EOF' > apps/backend/app/core/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    class Config:
        env_file = "/app/docker/backend/dev.env"

settings = Settings()
EOF

# Créer database.py
cat <<'EOF' > apps/backend/app/core/database.py
from sqlmodel import SQLModel, create_engine
from app.core.config import settings

DATABASE_URL = (
    f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}"
    f"@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
)

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)
EOF

echo "✅ Structure sacrée créée avec succès."
echo "⚡ Pour lancer : docker compose up --build"
