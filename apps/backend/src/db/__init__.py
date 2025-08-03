"""
Module de gestion de la base de données.

Ce module fournit les fonctionnalités de base pour interagir avec la base de données,
y compris la configuration de la session, les modèles et l'initialisation.
"""
from .base import (
    Base,              # Base déclarative SQLAlchemy
    SessionLocal,      # Session de base de données
    engine,            # Moteur SQLAlchemy
    get_db,            # Dépendance FastAPI pour les routes
    get_async_db,      # Version asynchrone pour les tests
    init_db,           # Fonction d'initialisation de la base de données
)

# Import des modèles pour faciliter les imports
from .init_db import init_db as init_database
from .models import User  # Import User from db.models

# Import Product and Purchase models from src.models
from src.models.product import Product, ProductDB
from src.models.purchase import Purchase, PurchaseDB, PurchaseStatus

# Export des symboles principaux
__all__ = [
    'Base',
    'SessionLocal',
    'engine',
    'get_db',
    'get_async_db',
    'init_db',
    'init_database',  # Alias pour la compatibilité
    'PurchaseStatus',
]

# Version du module
__version__ = '1.0.0'
