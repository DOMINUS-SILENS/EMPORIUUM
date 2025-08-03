from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from ..models.user import User, UserRole
from ..schemas.user import UserCreate, UserUpdate, UserInDB
from ..core.security import get_password_hash, verify_password
from ..core.config import settings

class UserService:
    """Service pour gérer les opérations liées aux utilisateurs"""
    
    @staticmethod
    def get_user(db: Session, user_id: int) -> Optional[User]:
        """Récupère un utilisateur par son ID"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Récupère un utilisateur par son email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_users(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        is_active: Optional[bool] = None,
        role: Optional[UserRole] = None
    ) -> List[User]:
        """Récupère une liste d'utilisateurs avec filtrage optionnel"""
        query = db.query(User)
        
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
            
        if role is not None:
            query = query.filter(User.role == role)
            
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def count_by_role(db: Session, role_name: str) -> int:
        """Compte les utilisateurs par rôle."""
        try:
            role_enum = UserRole[role_name.upper()]
            return db.query(User).filter(User.role == role_enum).count()
        except KeyError:
            # Handle case where role_name is not a valid UserRole
            return 0
    
    @staticmethod
    def create_user(db: Session, user_in: UserCreate) -> User:
        """Crée un nouvel utilisateur avec un mot de passe hashé"""
        hashed_password = get_password_hash(user_in.password)
        db_user = User(
            email=user_in.email,
            hashed_password=hashed_password,
            full_name=user_in.full_name,
            role=user_in.role,
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def update_user(
        db: Session, 
        db_user: User, 
        user_in: UserUpdate,
        update_password: bool = False
    ) -> User:
        """Met à jour un utilisateur existant"""
        update_data = user_in.dict(exclude_unset=True)
        
        # Gestion du mot de passe si fourni
        if update_password and "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        
        # Mise à jour des champs
        for field, value in update_data.items():
            setattr(db_user, field, value)
            
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> Optional[User]:
        """Supprime un utilisateur par son ID"""
        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user:
            db.delete(db_user)
            db.commit()
        return db_user
    
    @staticmethod
    def authenticate(
        db: Session, 
        email: str, 
        password: str
    ) -> Optional[User]:
        """Authentifie un utilisateur avec email/mot de passe"""
        user = UserService.get_user_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
    
    @staticmethod
    def is_active(user: User) -> bool:
        """Vérifie si un utilisateur est actif"""
        return user.is_active
    
    @staticmethod
    def is_superuser(user: User) -> bool:
        """Vérifie si un utilisateur est administrateur"""
        return user.role == UserRole.ADMIN
    
    @staticmethod
    def change_password(
        db: Session, 
        user: User, 
        current_password: str, 
        new_password: str
    ) -> bool:
        """Change le mot de passe d'un utilisateur"""
        if not verify_password(current_password, user.hashed_password):
            return False
            
        hashed_password = get_password_hash(new_password)
        user.hashed_password = hashed_password
        db.add(user)
        db.commit()
        return True
