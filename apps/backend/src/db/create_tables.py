import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .base import Base, engine

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_database_tables():
    """Crée toutes les tables de la base de données."""
    logger.info("Création des tables de la base de données...")
    try:
        # Créer toutes les tables définies dans les modèles
        Base.metadata.create_all(bind=engine)
        logger.info("Tables créées avec succès!")
        return True
    except Exception as e:
        logger.error(f"Erreur lors de la création des tables: {e}")
        return False

if __name__ == "__main__":
    print("Début de la création des tables...")
    if create_database_tables():
        print("Les tables ont été créées avec succès!")
    else:
        print("Une erreur est survenue lors de la création des tables.")
