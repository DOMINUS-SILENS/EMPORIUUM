import os
import sys
from pathlib import Path

# Ajout du répertoire courant au PYTHONPATH pour les imports
sys.path.append(str(Path(__file__).parent.absolute()))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers using relative paths
from routes.admin.router import router as admin_router
from routes.vendeur.router import router as vendeur_router
from routes.acheteur.router import router as acheteur_router
from routes.auth import router as auth_router
from models.db import Base, engine

app = FastAPI()

# Configuration CORS pour accepter tous les frontends locaux
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",  # welcome-app
        "http://localhost:8081",  # vendeur-app/achteur-app
        "http://localhost:3000",  # Autre frontend potentiel
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation automatique de la base de données en développement
if os.getenv("ENV") == "development":
    print("🛠️ Initialisation de la base de données en mode développement...")
    # Les modèles sont déjà importés via les routeurs
    Base.metadata.create_all(bind=engine)
    print("✅ Base de données initialisée !")

# Configuration CORS pour accepter le frontend sur port 8081
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],  # Port du frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_router, prefix="/admin")
app.include_router(vendeur_router, prefix="/vendeur")
app.include_router(acheteur_router, prefix="/acheteur")
app.include_router(auth_router, prefix="/auth")

@app.get("/")
def read_root():
    return {"message": "Backend API is running"} 