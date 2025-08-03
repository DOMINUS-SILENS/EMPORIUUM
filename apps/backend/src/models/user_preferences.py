from typing import Optional
from pydantic import BaseModel
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from src.db.base_class import Base

# --- Pydantic Schemas ---

class UserPreferencesBase(BaseModel):
    default_sort_by: Optional[str] = 'name'
    default_sort_order: Optional[str] = 'asc'

class UserPreferencesCreate(UserPreferencesBase):
    pass

class UserPreferencesUpdate(UserPreferencesBase):
    pass

class UserPreferences(UserPreferencesBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

# --- SQLAlchemy Model ---

class UserPreferencesDB(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    default_sort_by = Column(String, default='name')
    default_sort_order = Column(String, default='asc')

    user = relationship("User", back_populates="preferences")
