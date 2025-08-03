from datetime import datetime, timedelta
from typing import Any, Generator, Optional, Union

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from src.core.config import settings
from src.core.security import verify_password
from src.db.base import SessionLocal
from src.models.user import User, UserRole

# Schéma d'authentification OAuth2
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def get_db() -> Generator[Session, None, None]:
    """Fournit une session de base de données.
    
    À utiliser comme dépendance dans les routes FastAPI.
    La session est automatiquement fermée après utilisation.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> User:
    """Récupère l'utilisateur actuellement authentifié à partir du token JWT.
    
    Args:
        db: Session de base de données
        token: Token JWT d'authentification
        
    Returns:
        L'utilisateur authentifié
        
    Raises:
        HTTPException: Si le token est invalide ou l'utilisateur n'existe pas
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les informations d'identification",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"verify_aud": False},
        )
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
    except (JWTError, ValidationError):
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Vérifie que l'utilisateur actuel est actif.
    
    Args:
        current_user: Utilisateur actuellement authentifié
        
    Returns:
        L'utilisateur s'il est actif
        
    Raises:
        HTTPException: Si l'utilisateur est inactif
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cet utilisateur est inactif"
        )
    return current_user


def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """Vérifie que l'utilisateur actuel est un superutilisateur.
    
    Args:
        current_user: Utilisateur actuellement authentifié
        
    Returns:
        L'utilisateur s'il est un superutilisateur
        
    Raises:
        HTTPException: Si l'utilisateur n'est pas un superutilisateur
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="L'utilisateur n'a pas les privilèges suffisants"
        )
    return current_user


def get_current_active_vendeur(
    current_user: User = Depends(get_current_user),
) -> User:
    """Vérifie que l'utilisateur actuel est un vendeur.
    
    Args:
        current_user: Utilisateur actuellement authentifié
        
    Returns:
        L'utilisateur s'il est un vendeur
        
    Raises:
        HTTPException: Si l'utilisateur n'est pas un vendeur
    """
    if current_user.role != "vendeur" and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="L'utilisateur n'a pas les privilèges de vendeur"
        )
    return current_user


def get_current_active_acheteur(
    current_user: User = Depends(get_current_user),
) -> User:
    """Vérifie que l'utilisateur actuel est un acheteur.
    
    Args:
        current_user: Utilisateur actuellement authentifié
        
    Returns:
        L'utilisateur s'il est un acheteur
        
    Raises:
        HTTPException: Si l'utilisateur n'est pas un acheteur
    """
    if current_user.role != "acheteur" and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="L'utilisateur n'a pas les privilèges d'acheteur"
        )
    return current_user
