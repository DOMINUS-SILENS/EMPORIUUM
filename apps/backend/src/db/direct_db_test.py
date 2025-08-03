import logging
import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_direct_db():
    """Test direct database connection and table creation using psycopg2."""
    # Connection parameters
    db_params = {
        'host': 'db',
        'database': 'ecommerce',
        'user': 'postgres',
        'password': 'postgres',
        'port': 5432
    }
    
    try:
        # Connect to PostgreSQL
        logger.info("Connecting to the PostgreSQL database...")
        conn = psycopg2.connect(**db_params)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check connection
        logger.info("PostgreSQL database version:")
        cursor.execute("SELECT version();")
        db_version = cursor.fetchone()
        logger.info(db_version[0])
        
        # Check current database
        cursor.execute("SELECT current_database();")
        db_name = cursor.fetchone()[0]
        logger.info(f"Current database: {db_name}")
        
        # Check current schema
        cursor.execute("SELECT current_schema();")
        schema = cursor.fetchone()[0]
        logger.info(f"Current schema: {schema}")
        
        # List all schemas
        cursor.execute("SELECT nspname FROM pg_catalog.pg_namespace;")
        schemas = [row[0] for row in cursor.fetchall()]
        logger.info(f"Available schemas: {schemas}")
        
        # List all tables in the current schema
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        """)
        tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"Tables in public schema: {tables}")
        
        # Create a test table if it doesn't exist
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS test_table (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        logger.info("Creating test table...")
        cursor.execute(create_table_sql)
        logger.info("Test table created successfully!")
        
        # Verify the table was created
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'test_table';
        """)
        if cursor.fetchone():
            logger.info("Test table exists in the database!")
            
            # Insert a test record
            cursor.execute(
                "INSERT INTO test_table (name) VALUES (%s) RETURNING id;",
                ("Test Record",)
            )
            record_id = cursor.fetchone()[0]
            logger.info(f"Inserted test record with ID: {record_id}")
            
            # Query the test record
            cursor.execute("SELECT * FROM test_table WHERE id = %s;", (record_id,))
            record = cursor.fetchone()
            logger.info(f"Retrieved test record: {record}")
        else:
            logger.error("Test table was not created!")
        
        # Close communication with the database
        cursor.close()
        conn.close()
        logger.info("Database connection closed.")
        
    except (Exception, psycopg2.DatabaseError) as error:
        logger.error(f"Error: {error}")
        return False
    
    return True

if __name__ == "__main__":
    print("Testing direct database connection and table creation...")
    if test_direct_db():
        print("Direct database test completed successfully!")
    else:
        print("Direct database test failed. Check the logs for details.")
        exit(1)
