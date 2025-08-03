import os
import sys
from pathlib import Path

# Add the parent directory to PYTHONPATH for absolute imports
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent
sys.path.insert(0, str(parent_dir))

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Import using absolute imports from the src directory
from src.api.v1.api import api_router
from src.core.config import settings
from src.core.limiter import limiter
from src.core.exceptions import register_exception_handlers
from src.db.base import Base, engine
from src.db.init_db import init_db

# Création de l'application FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API pour la plateforme E-Commerce",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Content-Security-Policy"] = "default-src 'self'; object-src 'none';"
    # Ensure HSTS is only sent over HTTPS
    if request.url.scheme == "https":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# Configuration CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Enregistrement des gestionnaires d'exceptions personnalisés
app = register_exception_handlers(app)

# Montage des dossiers statiques pour les fichiers uploadés
app.mount(
    "/static",
    StaticFiles(directory=str(settings.STATIC_DIR)),
    name="static",
)

# Inclure les routeurs API
app.include_router(api_router, prefix=settings.API_V1_STR)

# Création des tables de la base de données au démarrage
@app.on_event("startup")
async def startup_event():
    """Initialisation de l'application au démarrage."""
    # Créer le dossier d'upload s'il n'existe pas
    os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
    
    # Initialiser la base de données
    if settings.ENVIRONMENT == "development":
        print("Initialisation de la base de données...")
        Base.metadata.create_all(bind=engine)
        await init_db()
        print("Base de données initialisée avec succès.")
    
    print(f"Application démarrée en mode {settings.ENVIRONMENT}")

# Route de santé
@app.get("/health", include_in_schema=False)
async def health_check():
    """Vérification de l'état de l'API."""
    return {"status": "ok", "environment": settings.ENVIRONMENT}

# Redirection de la racine vers la documentation
@app.get("/", include_in_schema=False)
async def root():
    """Redirige vers la documentation de l'API."""
    return JSONResponse(
        status_code=status.HTTP_307_TEMPORARY_REDIRECT,
        headers={"Location": "/docs"},
    )

# Gestionnaire pour les erreurs 404 personnalisées
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception):
    """Gestion personnalisée des erreurs 404."""
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": "Ressource non trouvée"},
    )

# Point d'entrée pour l'exécution avec uvicorn
if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
