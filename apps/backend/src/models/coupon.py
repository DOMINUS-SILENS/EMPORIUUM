from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from src.db.base_class import Base

# Pydantic models

class CouponBase(BaseModel):
    code: str
    discount_percentage: float
    expires_at: datetime
    is_active: bool = True

class CouponCreate(CouponBase):
    pass


class CouponCreateAdmin(CouponBase):
    seller_id: int

class CouponUpdate(BaseModel):
    code: Optional[str] = None
    discount_percentage: Optional[float] = None
    expires_at: Optional[datetime] = None
    is_active: Optional[bool] = None

class Coupon(CouponBase):
    id: int
    seller_id: int

    class Config:
        orm_mode = True

# SQLAlchemy model

class CouponDB(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    discount_percentage = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)

    seller_id = Column(Integer, ForeignKey("users.id"))
    seller = relationship("User", back_populates="coupons")

    def __repr__(self):
        return f"<Coupon(id={self.id}, code='{self.code}')>"
