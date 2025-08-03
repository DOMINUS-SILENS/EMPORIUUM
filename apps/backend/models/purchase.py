from pydantic import BaseModel
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from backend.models.db import Base

class PurchaseDB(Base):
    __tablename__ = "purchases"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    user = relationship("UserDB", backref="purchases")
    product = relationship("ProductDB", backref="purchases")

class PurchaseCreate(BaseModel):
    user_id: int
    product_id: int
    
    class Config:
        schema_extra = {
            "example": {
                "user_id": 2,
                "product_id": 1
            }
        }

class Purchase(BaseModel):
    id: int
    user_id: int
    product_id: int

    class Config:
        from_attributes = True  # Replaces orm_mode in Pydantic v2