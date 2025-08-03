from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field, validator, condecimal
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from src.db.base_class import Base


class ProductBase(BaseModel):
    """Schéma de base pour les produits."""
    name: str = Field(..., min_length=3, max_length=255, description="Nom du produit")
    description: Optional[str] = Field(None, max_length=2000, description="Description détaillée du produit")
    price: condecimal(gt=0, decimal_places=2) = Field(..., description="Prix du produit")
    quantity: int = Field(..., ge=0, description="Quantité disponible en stock")
    category: str = Field(..., max_length=100, description="Catégorie du produit")
    image_url: Optional[str] = Field(None, description="URL de l'image du produit")
    is_active: bool = Field(default=True, description="Indique si le produit est disponible à la vente")
    
    @validator('price')
    def validate_price(cls, v):
        if v <= 0:
            raise ValueError("Le prix doit être supérieur à 0")
        return v
    
    @validator('quantity')
    def validate_quantity(cls, v):
        if v < 0:
            raise ValueError("La quantité ne peut pas être négative")
        return v


class ProductCreate(ProductBase):
    """Schéma pour la création d'un produit."""
    pass


class ProductCreateAdmin(ProductBase):
    """Schéma pour la création d'un produit par un admin."""
    seller_id: int = Field(..., description="Identifiant du vendeur")


class ProductUpdate(BaseModel):
    """Schéma pour la mise à jour d'un produit."""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    quantity: Optional[int] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class ProductInDBBase(ProductBase):
    """Schéma de base pour un produit en base de données."""
    id: int = Field(..., description="Identifiant unique du produit")
    seller_id: int = Field(..., description="Identifiant du vendeur")
    created_at: datetime = Field(..., description="Date de création du produit")
    updated_at: datetime = Field(..., description="Date de dernière mise à jour du produit")

    class Config:
        orm_mode = True
        json_encoders = {
            Decimal: lambda v: str(v)
        }


class Product(ProductInDBBase):
    """Schéma pour l'affichage d'un produit."""
    pass


# Modèle SQLAlchemy
class ProductDB(Base):
    """Modèle SQLAlchemy pour la table des produits."""
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float(asdecimal=True, decimal_return_scale=2), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    category = Column(String(100), nullable=False, index=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Clé étrangère vers l'utilisateur (vendeur)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    seller = relationship("User", back_populates="products")
    purchases = relationship("PurchaseDB", back_populates="product")
    
    def __repr__(self):
        return f"<Product(id={self.id}, name={self.name}, price={self.price})>"
    
    def to_dict(self):
        """Convertit le produit en dictionnaire."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": float(self.price) if self.price is not None else None,
            "quantity": self.quantity,
            "category": self.category,
            "image_url": self.image_url,
            "is_active": self.is_active,
            "seller_id": self.seller_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
