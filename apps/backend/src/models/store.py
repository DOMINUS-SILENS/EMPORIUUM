from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from src.db.base_class import Base


class StoreBase(BaseModel):
    """Base schema for a seller's store."""
    name: str = Field(..., min_length=3, max_length=100, description="Name of the store")
    slug: str = Field(..., min_length=3, max_length=100, description="Unique URL-friendly slug for the store")
    description: Optional[str] = Field(None, max_length=5000, description="Detailed description of the store")
    logo_url: Optional[str] = Field(None, description="URL for the store's logo")
    cover_image_url: Optional[str] = Field(None, description="URL for the store's cover image")
    theme_color: Optional[str] = Field(None, max_length=7, description="Primary color theme for the store (hex code, e.g., #RRGGBB)")


class StoreCreate(StoreBase):
    """Schema for creating a store."""
    pass


class StoreUpdate(BaseModel):
    """Schema for updating a store."""
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    theme_color: Optional[str] = None


class StoreInDBBase(StoreBase):
    """Base schema for a store in the database."""
    id: int = Field(..., description="Unique identifier for the store")
    seller_id: int = Field(..., description="Identifier of the seller who owns the store")
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class Store(StoreInDBBase):
    """Schema for displaying a store."""
    pass


class StoreDB(Base):
    """SQLAlchemy model for the stores table."""
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String(500), nullable=True)
    cover_image_url = Column(String(500), nullable=True)
    theme_color = Column(String(7), nullable=True)

    # Foreign key to the user (seller)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    seller = relationship("User", back_populates="store")

    def __repr__(self):
        return f"<Store(id={self.id}, name={self.name}, seller_id={self.seller_id})>"
