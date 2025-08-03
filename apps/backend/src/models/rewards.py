from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from src.db.base_class import Base

# --- Pydantic Schemas ---

class LoyaltyTransactionBase(BaseModel):
    points_change: int
    reason: str

class LoyaltyTransaction(LoyaltyTransactionBase):
    id: int
    created_at: DateTime

    class Config:
        orm_mode = True

class LoyaltyAccountBase(BaseModel):
    points_balance: int

class LoyaltyAccount(LoyaltyAccountBase):
    id: int
    user_id: int
    transactions: List[LoyaltyTransaction] = []

    class Config:
        orm_mode = True

# --- SQLAlchemy Models ---

class LoyaltyAccountDB(Base):
    __tablename__ = "loyalty_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    points_balance = Column(Integer, nullable=False, default=0)

    user = relationship("User", back_populates="loyalty_account")
    transactions = relationship("LoyaltyTransactionDB", back_populates="account", cascade="all, delete-orphan")

class LoyaltyTransactionDB(Base):
    __tablename__ = "loyalty_transactions"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("loyalty_accounts.id"), nullable=False)
    points_change = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    account = relationship("LoyaltyAccountDB", back_populates="transactions")
