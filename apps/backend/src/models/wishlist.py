from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import Column, ForeignKey, Integer, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from src.db.base_class import Base
from .product import Product

# --- Pydantic Schemas ---

class WishlistItemBase(BaseModel):
    product_id: int

class WishlistItemCreate(WishlistItemBase):
    pass

class WishlistItem(WishlistItemBase):
    id: int
    wishlist_id: int
    product: Product

    class Config:
        orm_mode = True

class WishlistBase(BaseModel):
    pass

class Wishlist(WishlistBase):
    id: int
    user_id: int
    items: List[WishlistItem] = []

    class Config:
        orm_mode = True

# --- SQLAlchemy Models ---

class WishlistDB(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    user = relationship("User", back_populates="wishlist")
    items = relationship("WishlistItemDB", back_populates="wishlist", cascade="all, delete-orphan")

class WishlistItemDB(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    wishlist_id = Column(Integer, ForeignKey("wishlists.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    wishlist = relationship("WishlistDB", back_populates="items")
    product = relationship("ProductDB")
