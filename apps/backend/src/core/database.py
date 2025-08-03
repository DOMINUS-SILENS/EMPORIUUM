from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Création du moteur SQLAlchemy
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI, connect_args={"check_same_thread": False} if "sqlite" in settings.SQLALCHEMY_DATABASE_URI else {}
)

# Session locale
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base pour les modèles
Base = declarative_base()

def get_db():
    """
    Fournit une instance de session de base de données.
    À utiliser comme dépendance dans les routes FastAPI.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
