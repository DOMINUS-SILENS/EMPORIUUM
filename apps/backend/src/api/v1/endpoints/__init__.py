"""
API v1 endpoints package for the E-Commerce platform.

This package contains all the API endpoints for version 1 of the API.
"""

# Import endpoint modules to make them available when importing from api.v1.endpoints
from . import auth, users

__all__ = ["auth", "users"]
