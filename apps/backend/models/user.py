from pydantic import BaseModel, validator
from typing import Literal, Optional
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean
from backend.models.db import Base

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String, index=True)
    password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(String)  # datetime stored as string
    updated_at = Column(String, nullable=True)  # datetime stored as string

# Import déjà présent plus haut
from py_common.validators import validate_password_strength
from pydantic import EmailStr

class UserCreate(BaseModel):
    full_name: Optional[str] = None
    email: EmailStr
    password: str
    role: Literal['acheteur', 'vendeur', 'admin'] = 'acheteur'
    
    @validator('full_name')
    def validate_full_name(cls, v):
        if v is not None and len(v.strip()) < 2:
            raise ValueError("Le nom complet est trop court")
        return v.strip() if v else None
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères")
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "full_name": "John Doe",
                "email": "john.doe@example.com",
                "password": "Secure123!",
                "role": "acheteur"
            }
        }

class User(BaseModel):
    id: int
    full_name: Optional[str] = None
    email: str
    role: Literal['admin', 'vendeur', 'acheteur']
    is_active: bool = True
    created_at: str  # datetime as string
    updated_at: Optional[str] = None  # datetime as string

    class Config:
        from_attributes = True