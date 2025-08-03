"""
Module containing all SQLAlchemy models for the application.

This module centralizes all model definitions to avoid circular imports.
"""
from sqlalchemy import Boolean, Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from .base_class import Base

class UserRole(str, enum.Enum):
    """Rôles disponibles pour les utilisateurs"""
    ADMIN = "admin"
    VENDEUR = "vendeur"
    ACHETEUR = "acheteur"

class User(Base):
    """Modèle utilisateur pour la base de données"""
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}  # Pour éviter les erreurs de redéfinition
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    is_active = Column(Boolean(), default=True)
    role = Column(Enum(UserRole), default=UserRole.ACHETEUR, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Use string-based relationships to avoid circular imports
    products = relationship("ProductDB", back_populates="seller")
    purchases = relationship("PurchaseDB", back_populates="buyer")
    store = relationship("StoreDB", back_populates="seller", uselist=False)
    coupons = relationship("CouponDB", back_populates="seller")
    cart = relationship("CartDB", back_populates="user", uselist=False)
    loyalty_account = relationship("LoyaltyAccountDB", back_populates="user", uselist=False)
    support_tickets = relationship("SupportTicketDB", back_populates="user")
    wishlist = relationship("WishlistDB", back_populates="user", uselist=False)
    preferences = relationship("UserPreferencesDB", back_populates="user", uselist=False)
    
    def __repr__(self):
        return f"<User {self.email}>"
    
    @property
    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN
    
    @property
    def is_vendeur(self) -> bool:
        return self.role == UserRole.VENDEUR
    
    @property
    def is_acheteur(self) -> bool:
        return self.role == UserRole.ACHETEUR

# Models are imported in __init__.py to avoid circular imports
