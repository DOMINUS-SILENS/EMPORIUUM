"""
Legacy user model module.

This module is maintained for backward compatibility.
New code should import User and UserRole directly from src.db.models.
"""
from src.db.models import User, UserRole  # noqa

__all__ = ['User', 'UserRole']
