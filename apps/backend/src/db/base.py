import logging
import time
from contextlib import contextmanager
from typing import Generator, Optional

from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

from src.core.config import settings
from .base_class import Base  # Import Base from base_class.py

# Configuration du logger
logger = logging.getLogger(__name__)

# Création du moteur de base de données
if settings.TESTING:
    # Base de données SQLite en mémoire pour les tests
    SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
elif settings.DEBUG and not settings.SQLALCHEMY_DATABASE_URI:
    # SQLite pour le développement local si aucune URL n'est fournie
    SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL pour la production
    engine = create_engine(
        str(settings.SQLALCHEMY_DATABASE_URI),
        pool_pre_ping=True,
        pool_recycle=3600,  # Recycle les connexions après 1 heure
        pool_size=10,  # Taille minimale du pool de connexions
        max_overflow=20,  # Taille maximale du pool de connexions
    )

# Configuration de la session de base de données
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Pour le support asynchrone dans les tests
if settings.TESTING:
    from sqlalchemy.orm import sessionmaker as async_sessionmaker
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
    
    async_engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        future=True,
        connect_args={"check_same_thread": False},
    )
    
    AsyncSessionLocal = async_sessionmaker(
        bind=async_engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )


@contextmanager
def get_db() -> Generator[Session, None, None]:
    """Fournit une session de base de données pour une requête.
    
    Utilisation:
        with get_db() as db:
            # Utiliser la session db ici
            db.query(...)
    
    La session est automatiquement fermée après utilisation.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Database error: {e}")
        raise
    finally:
        db.close()


async def get_async_db() -> Generator[AsyncSession, None, None]:
    """Fournit une session asynchrone pour les tests."""
    if not settings.TESTING:
        raise RuntimeError("get_async_db ne peut être utilisé qu'en mode test")
        
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Async database error: {e}")
            raise


def init_db() -> None:
    """Initialise la base de données en créant toutes les tables."""
    from models.user import User
    # Uncomment and update these imports when the models are available
    # from models.product import Product
    # from models.purchase import Purchase
    
    logger.info("Création des tables de la base de données...")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables créées avec succès.")


# Événements SQLAlchemy pour le débogage
if settings.DEBUG:
    @event.listens_for(Engine, "before_cursor_execute")
    def before_cursor_execute(conn, cursor, statement, params, context, executemany):
        conn.info.setdefault("query_start_time", []).append(time.time())
        logger.debug("Query: %s", statement)
        if params:
            logger.debug("Parameters: %s", params)

    @event.listens_for(Engine, "after_cursor_execute")
    def after_cursor_execute(conn, cursor, statement, params, context, executemany):
        total = time.time() - conn.info["query_start_time"].pop(-1)
        logger.debug("Query completed in %fms", total * 1000)


# Import des modèles centralisés pour éviter les imports circulaires
# Les modèles sont maintenant importés dans src/db/models.py
# Cette importation est nécessaire pour que SQLAlchemy découvre les modèles
from . import models  # noqa
