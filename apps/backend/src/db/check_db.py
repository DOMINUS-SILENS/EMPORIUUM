import logging
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker

from .base import Base, engine
from ..core.config import settings

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_database():
    """Vérifie la connexion à la base de données et l'existence des tables."""
    logger.info("Vérification de la base de données...")
    
    # Créer une nouvelle connexion
    engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
    
    # Vérifier la connexion
    try:
        with engine.connect() as conn:
            logger.info("Connexion à la base de données réussie!")
            
            # Vérifier les tables existantes
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            logger.info(f"Tables existantes: {tables}")
            
            # Vérifier si les tables nécessaires existent
            required_tables = ['users', 'products', 'purchases']
            missing_tables = [t for t in required_tables if t not in tables]
            
            if missing_tables:
                logger.warning(f"Tables manquantes: {missing_tables}")
                logger.info("Tentative de création des tables...")
                
                # Créer les tables manquantes
                Base.metadata.create_all(bind=engine)
                logger.info("Tables créées avec succès!")
                
                # Vérifier à nouveau les tables
                inspector = inspect(engine)
                tables = inspector.get_table_names()
                logger.info(f"Tables après création: {tables}")
            else:
                logger.info("Toutes les tables nécessaires existent!")
                
    except Exception as e:
        logger.error(f"Erreur lors de la vérification de la base de données: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("Vérification de la base de données...")
    if check_database():
        print("Vérification terminée avec succès!")
    else:
        print("Des erreurs sont survenues lors de la vérification.")
