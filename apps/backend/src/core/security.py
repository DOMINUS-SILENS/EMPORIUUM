from datetime import datetime, timedelta
from typing import Any, Optional, Union

from jose import jwt
from passlib.context import CryptContext
from pydantic import ValidationError

from src.core.config import settings

# Configuration pour le hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """Crée un token JWT d'accès.
    
    Args:
        subject: Sujet du token (généralement l'ID de l'utilisateur)
        expires_delta: Durée de validité du token
        
    Returns:
        Un token JWT encodé
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(subject: Union[str, Any]) -> str:
    """Crée un token de rafraîchissement JWT.
    
    Args:
        subject: Sujet du token (généralement l'ID de l'utilisateur)
        
    Returns:
        Un token de rafraîchissement JWT encodé
    """
    expire = datetime.utcnow() + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(
        to_encode, settings.REFRESH_SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie qu'un mot de passe en clair correspond à un hachage.
    
    Args:
        plain_password: Mot de passe en clair
        hashed_password: Mot de passe haché
        
    Returns:
        bool: True si le mot de passe correspond, False sinon
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Génère un hachage sécurisé pour un mot de passe.
    
    Args:
        password: Mot de passe en clair
        
    Returns:
        Le mot de passe haché
    """
    return pwd_context.hash(password)


def decode_token(token: str) -> dict:
    """Décode un token JWT.
    
    Args:
        token: Token JWT à décoder
        
    Returns:
        Le contenu décodé du token
        
    Raises:
        HTTPException: Si le token est invalide ou expiré
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"verify_aud": False},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Impossible de valider les informations d'identification",
            headers={"WWW-Authenticate": "Bearer"},
        )


def generate_password_reset_token(email: str) -> str:
    """Génère un token pour la réinitialisation du mot de passe.
    
    Args:
        email: Email de l'utilisateur
        
    Returns:
        Un token JWT pour la réinitialisation du mot de passe
    """
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.utcnow()
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email, "type": "password_reset"},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt


def verify_password_reset_token(token: str) -> Optional[str]:
    """Vérifie un token de réinitialisation de mot de passe.
    
    Args:
        token: Token à vérifier
        
    Returns:
        L'email associé au token si valide, None sinon
    """
    try:
        decoded_token = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        if decoded_token["type"] != "password_reset":
            return None
        return decoded_token["sub"]
    except (jwt.JWTError, ValidationError):
        return None
