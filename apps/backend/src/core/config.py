import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn, validator


class Settings(BaseSettings):
    # Configuration de base de l'API
    PROJECT_NAME: str = "E-Commerce Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ALGORITHM: str = "HS256"
    
    # Configuration CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",  # welcome-app
        "http://localhost:3001",  # vendeur-app
        "http://localhost:3002",  # achteur-app
        "http://localhost:8080",  # Autres ports potentiels
        "http://localhost:8081",
    ]

    # Configuration de la base de données
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: str = "5432"
    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            port=values.get("POSTGRES_PORT"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )

    # Configuration du premier superutilisateur
    FIRST_SUPERUSER_EMAIL: EmailStr
    FIRST_SUPERUSER_PASSWORD: str
    FIRST_SUPERUSER_FULL_NAME: str = "Admin"
    
    # Configuration des répertoires statiques
    STATIC_DIR: str = "static"
    
    # Configuration de l'email (optionnel)
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[EmailStr] = None
    EMAILS_FROM_NAME: Optional[str] = None
    
    @validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        if not v:
            return "E-Commerce Platform"
        return v

    # Configuration du token de réinitialisation de mot de passe
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 24
    
    # Configuration des logs
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOG_DATEFORMAT: str = "%Y-%m-%d %H:%M:%S"
    
    # Configuration de l'environnement
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    TESTING: bool = False
    
    # Configuration de la pagination
    DEFAULT_PAGE_SIZE: int = 10
    MAX_PAGE_SIZE: int = 100
    
    # Configuration des fichiers uploadés
    UPLOAD_FOLDER: str = "uploads"
    MAX_CONTENT_LENGTH: int = 16 * 1024 * 1024  # 16MB max upload
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "gif"]
    
    # Configuration de la sécurité
    SECURE_COOKIES: bool = not DEBUG
    SESSION_COOKIE_SECURE: bool = not DEBUG
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "lax"

    # Stripe Configuration
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_CURRENCY: Optional[str] = "eur"
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"


# Instance de configuration globale
settings = Settings()
