from typing import List, Optional
from pydantic import BaseModel, Field
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from src.db.base_class import Base
from .product import Product # Import Product for schema nesting

# --- Pydantic Schemas ---

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., gt=0)

class CartItem(CartItemBase):
    id: int
    product: Product

    class Config:
        orm_mode = True

class CartBase(BaseModel):
    pass

class Cart(CartBase):
    id: int
    user_id: int
    items: List[CartItem] = []

    class Config:
        orm_mode = True

# --- SQLAlchemy Models ---

class CartDB(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    user = relationship("User", back_populates="cart")
    items = relationship("CartItemDB", back_populates="cart", cascade="all, delete-orphan")

class CartItemDB(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)

    cart = relationship("CartDB", back_populates="items")
    product = relationship("ProductDB")
