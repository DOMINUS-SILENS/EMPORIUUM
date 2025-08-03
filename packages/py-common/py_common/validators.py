from passlib.context import CryptContext
from fastapi import HTTPException, status
import re

# Configuration du hachage de mot de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def validate_password_strength(password: str) -> None:
    """
    Valide la force du mot de passe selon les critères suivants :
    - Au moins 8 caractères
    - Au moins une lettre minuscule
    - Au moins une lettre majuscule
    - Au moins un chiffre
    - Au moins un caractère spécial
    """
    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le mot de passe doit contenir au moins 8 caractères"
        )
    
    if not re.search(r"[a-z]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le mot de passe doit contenir au moins une lettre minuscule"
        )
    
    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le mot de passe doit contenir au moins une lettre majuscule"
        )
    
    if not re.search(r"\d", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le mot de passe doit contenir au moins un chiffre"
        )
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le mot de passe doit contenir au moins un caractère spécial"
        )

def hash_password(password: str) -> str:
    """Hash un mot de passe"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie si un mot de passe correspond à son hash"""
    return pwd_context.verify(plain_password, hashed_password)
