from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Generator
from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..core.config import settings
from ..core.security import verify_password
from ..models.user import User
from ..schemas.user import TokenData, UserInDB
from .user_service import UserService

# Import get_db from api.deps
from ..api.deps import get_db

class AuthService:
    """Service pour gérer l'authentification et la création de jetons JWT"""
    
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")
    
    @staticmethod
    def create_access_token(
        data: Dict[str, Any], 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Crée un nouveau token JWT d'accès"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
            
        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.SECRET_KEY, 
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Crée un nouveau token de rafraîchissement"""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=7)
            
        to_encode = data.copy()
        to_encode.update({"exp": expire, "type": "refresh"})
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Dict[str, Any]:
        """Vérifie et décode un token JWT"""
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            return payload
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide ou expiré",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    @classmethod
    def get_current_user(
        cls,
        db: Session = Depends(get_db),
        token: str = Depends(lambda: cls.oauth2_scheme)  # Use class reference for oauth2_scheme
    ) -> User:
        """Récupère l'utilisateur actuel à partir du token"""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Impossible de valider les identifiants",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            payload = AuthService.verify_token(token)
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
            token_data = TokenData(email=email)
        except Exception:
            raise credentials_exception
            
        user = UserService.get_user_by_email(db, email=token_data.email)
        if user is None:
            raise credentials_exception
            
        return user
    
    @classmethod
    def get_current_active_user(
        cls,
        current_user: User = Depends(lambda: AuthService.get_current_user),
    ) -> User:
        """Vérifie que l'utilisateur actuel est actif"""
        if not UserService.is_active(current_user):
            raise HTTPException(status_code=400, detail="Utilisateur inactif")
        return current_user
    
    @staticmethod
    def authenticate_user(
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
    def get_token_payload(token: str) -> Dict[str, Any]:
        """Récupère le payload d'un token JWT"""
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            return payload
        except jwt.JWTError:
            return {}
    
    @staticmethod
    def is_token_blacklisted(token: str) -> bool:
        """Vérifie si un token est dans la liste noire"""
        # À implémenter : vérification dans une base de données ou un cache
        return False
    
    @staticmethod
    def blacklist_token(token: str) -> None:
        """Ajoute un token à la liste noire"""
        # À implémenter : stockage dans une base de données ou un cache
        pass

# Instance du service
auth_service = AuthService()

# Create callable functions for FastAPI dependencies
get_current_user = auth_service.get_current_user
get_current_active_user = auth_service.get_current_active_user
