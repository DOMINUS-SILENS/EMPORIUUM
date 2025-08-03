from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    """Rôles disponibles pour les utilisateurs"""
    ADMIN = "admin"
    VENDEUR = "vendeur"
    ACHETEUR = "acheteur"

# Schémas de base
class UserBase(BaseModel):
    """Schéma de base pour un utilisateur"""
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.ACHETEUR

# Pour la création d'un utilisateur (mot de passe requis)
class UserCreate(UserBase):
    """Schéma pour la création d'un utilisateur"""
    password: str = Field(..., min_length=8, description="Le mot de passe doit contenir au moins 8 caractères")
    
    # @validator('password')
    # def password_strength(cls, v):
    #     if len(v) < 8:
    #         raise ValueError('Le mot de passe doit contenir au moins 8 caractères')
    #     # Ajouter d'autres validations de mot de passe si nécessaire
    #     return v

# Pour la mise à jour d'un utilisateur (tous les champs optionnels)
class UserUpdate(BaseModel):
    """Schéma pour la mise à jour d'un utilisateur"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None

# Pour la réponse API (sans le mot de passe)
class UserInDBBase(UserBase):
    """Schéma de base pour la réponse API"""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True  # Anciennement orm_mode = True

# Schémas pour les réponses API
class User(UserInDBBase):
    """Schéma pour la réponse API (sans les données sensibles)"""
    pass

class UserInDB(UserInDBBase):
    """Schéma pour l'utilisateur dans la base de données (avec mot de passe hashé)"""
    hashed_password: str

# Schéma pour l'authentification
class Token(BaseModel):
    """Schéma pour le token JWT"""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Schéma pour les données du token JWT"""
    email: Optional[str] = None
    scopes: List[str] = []

# Schéma pour la connexion
class Login(BaseModel):
    """Schéma pour la connexion d'un utilisateur"""
    email: EmailStr
    password: str


class PasswordUpdate(BaseModel):
    """Schéma pour la mise à jour du mot de passe"""
    old_password: str
    new_password: str
