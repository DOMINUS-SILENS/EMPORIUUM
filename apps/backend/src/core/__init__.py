"""
Core package for the E-Commerce platform.

This package contains core functionality used throughout the application,
including configuration, database connection, and utility functions.
"""

# Import core modules to make them available when importing from core
from .config import settings
from .database import Base, SessionLocal, engine, get_db

__all__ = ["settings", "Base", "SessionLocal", "engine", "get_db"]
