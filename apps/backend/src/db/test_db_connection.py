import logging
import sys
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker

# Add the parent directory to the Python path
from pathlib import Path
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent.parent
sys.path.insert(0, str(parent_dir))

from src.core.config import settings
from src.db.base import Base
from src.db.models import User, Product, Purchase

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_connection():
    """Test database connection and table creation."""
    try:
        # Create a new engine and session
        engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        
        # Test raw connection
        with engine.connect() as conn:
            logger.info("Successfully connected to the database!")
            
            # Check current database
            result = conn.execute(text("SELECT current_database();"))
            db_name = result.scalar()
            logger.info(f"Current database: {db_name}")
            
            # Check current schema
            result = conn.execute(text("SELECT current_schema();"))
            schema = result.scalar()
            logger.info(f"Current schema: {schema}")
            
            # List all schemas
            result = conn.execute(text("SELECT nspname FROM pg_catalog.pg_namespace;"))
            schemas = [row[0] for row in result.fetchall()]
            logger.info(f"Available schemas: {schemas}")
            
            # List all tables in the current schema
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            logger.info(f"Tables in current schema: {tables}")
            
            # Create tables if they don't exist
            logger.info("Creating tables...")
            Base.metadata.create_all(bind=engine)
            logger.info("Tables created successfully!")
            
            # Check tables again
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            logger.info(f"Tables after creation: {tables}")
            
            # Verify tables in the database
            result = conn.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public';
            """)
            db_tables = [row[0] for row in result.fetchall()]
            logger.info(f"Tables in database (via information_schema): {db_tables}")
            
            return True
            
    except Exception as e:
        logger.error(f"Error testing database connection: {e}")
        return False

if __name__ == "__main__":
    print("Testing database connection and table creation...")
    if test_connection():
        print("Database test completed successfully!")
    else:
        print("Database test failed. Check the logs for details.")
        sys.exit(1)
