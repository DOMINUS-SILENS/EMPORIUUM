from pydantic import BaseModel, validator
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.models.db import Base

class ProductDB(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)
    vendeur_id = Column(Integer, ForeignKey("users.id"))
    vendeur = relationship("UserDB", backref="products")

class ProductCreate(BaseModel):
    name: str
    price: float
    vendeur_id: int

    @validator("price")
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Price must be positive")
        return v
        
    class Config:
        schema_extra = {
            "example": {
                "name": "Premium Product",
                "price": 99.99,
                "vendeur_id": 1
            }
        }

class Product(BaseModel):
    id: int
    name: str
    price: float
    vendeur_id: int

    class Config:
        from_attributes = True