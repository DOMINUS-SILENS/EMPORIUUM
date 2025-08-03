from typing import Optional

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Text

from src.db.base_class import Base


# Pydantic models
class SettingBase(BaseModel):
    key: str
    value: Optional[str] = None


class SettingCreate(SettingBase):
    pass


class SettingUpdate(BaseModel):
    value: Optional[str] = None


class Setting(SettingBase):
    id: int

    class Config:
        orm_mode = True


# SQLAlchemy model
class SettingDB(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(Text, nullable=True)

    def __repr__(self):
        return f"<Setting(id={self.id}, key='{self.key}')>"
