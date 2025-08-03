from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, condecimal, validator
from sqlalchemy import Column, DateTime, Enum as SQLEnum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from src.db.base_class import Base


class PurchaseStatus(str, Enum):
    PENDING = "en_attente"
    PAID = "payé"
    SHIPPED = "expédié"
    DELIVERED = "livré"
    CANCELLED = "annulé"
    REFUNDED = "remboursé"


class PurchaseBase(BaseModel):
    """Schéma de base pour les achats."""
    quantity: int = Field(..., gt=0, description="Quantité achetée")
    unit_price: condecimal(gt=0, decimal_places=2) = Field(..., description="Prix unitaire au moment de l'achat")
    status: PurchaseStatus = Field(
        default=PurchaseStatus.PENDING,
        description="Statut de la commande"
    )
    shipping_address: str = Field(..., max_length=500, description="Adresse de livraison")
    shipping_city: str = Field(..., max_length=100, description="Ville de livraison")
    shipping_postal_code: str = Field(..., max_length=20, description="Code postal de livraison")
    shipping_country: str = Field(..., max_length=100, description="Pays de livraison")
    
    @validator('quantity')
    def validate_quantity(cls, v):
        if v <= 0:
            raise ValueError("La quantité doit être supérieure à 0")
        return v
    
    @property
    def total_price(self) -> Decimal:
        """Calcule le prix total de l'achat."""
        return self.unit_price * self.quantity


class PurchaseCreate(PurchaseBase):
    """Schéma pour la création d'un achat."""
    product_id: int = Field(..., description="Identifiant du produit acheté")


class PurchaseUpdate(BaseModel):
    """Schéma pour la mise à jour d'un achat."""
    status: Optional[PurchaseStatus] = None
    tracking_number: Optional[str] = None
    stripe_payment_intent_id: Optional[str] = None
    shipping_address: Optional[str] = None
    shipping_city: Optional[str] = None
    shipping_postal_code: Optional[str] = None
    shipping_country: Optional[str] = None


class PurchaseInDBBase(PurchaseBase):
    """Schéma de base pour un achat en base de données."""
    id: int = Field(..., description="Identifiant unique de l'achat")
    product_id: int = Field(..., description="Identifiant du produit acheté")
    buyer_id: int = Field(..., description="Identifiant de l'acheteur")
    tracking_number: Optional[str] = Field(None, description="Numéro de suivi de livraison")
    stripe_payment_intent_id: Optional[str] = Field(None, description="Stripe Payment Intent ID")
    created_at: datetime = Field(..., description="Date de création de l'achat")
    updated_at: datetime = Field(..., description="Date de dernière mise à jour de l'achat")
    
    class Config:
        orm_mode = True
        json_encoders = {
            Decimal: lambda v: str(v)
        }


class Purchase(PurchaseInDBBase):
    """Schéma pour l'affichage d'un achat."""
    purchase_total: Decimal = Field(..., alias="total_price", description="Prix total de l'achat (quantité * prix unitaire)")


# Modèle SQLAlchemy
class PurchaseDB(Base):
    """Modèle SQLAlchemy pour la table des achats."""
    __tablename__ = "purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Informations sur l'achat
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float(asdecimal=True, decimal_return_scale=2), nullable=False)
    status = Column(SQLEnum(PurchaseStatus), default=PurchaseStatus.PENDING, nullable=False)
    tracking_number = Column(String(100), nullable=True)
    stripe_payment_intent_id = Column(String, index=True, nullable=True)
    
    # Adresse de livraison
    shipping_address = Column(String(500), nullable=False)
    shipping_city = Column(String(100), nullable=False)
    shipping_postal_code = Column(String(20), nullable=False)
    shipping_country = Column(String(100), nullable=False)
    
    # Clés étrangères
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Horodatage
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    product = relationship("ProductDB", back_populates="purchases")
    buyer = relationship("User", back_populates="purchases")
    
    def __repr__(self):
        return f"<Purchase(id={self.id}, product_id={self.product_id}, buyer_id={self.buyer_id}, status={self.status})>"
    
    @property
    def total_price(self) -> Decimal:
        """Calcule le prix total de l'achat."""
        return Decimal(str(self.unit_price)) * self.quantity
    
    def to_dict(self):
        """Convertit l'achat en dictionnaire."""
        return {
            "id": self.id,
            "product_id": self.product_id,
            "buyer_id": self.buyer_id,
            "quantity": self.quantity,
            "unit_price": float(self.unit_price) if self.unit_price is not None else None,
            "total_price": float(self.total_price) if self.total_price is not None else None,
            "status": self.status.value,
            "tracking_number": self.tracking_number,
            "shipping_address": self.shipping_address,
            "shipping_city": self.shipping_city,
            "shipping_postal_code": self.shipping_postal_code,
            "shipping_country": self.shipping_country,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
