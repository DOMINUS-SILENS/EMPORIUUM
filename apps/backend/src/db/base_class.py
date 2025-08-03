"""
SQLAlchemy base class for all models.

This module contains the base SQLAlchemy declarative base class that all models should inherit from.
It's separated from the rest of the database configuration to avoid circular imports.
"""
from sqlalchemy.ext.declarative import declarative_base

# Create a base class for all models to inherit from
Base = declarative_base()
