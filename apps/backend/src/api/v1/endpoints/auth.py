from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from src.core.config import settings
from src.db.models import User  
from src.schemas.user import Token, UserCreate, User as UserSchema, Login
from src.services.auth_service import auth_service
from src.services.user_service import UserService
from src.core.database import get_db
from src.core.limiter import limiter

router = APIRouter()

@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/hour")
async def register(
    request: Request, # Add request parameter for rate limiter
    user_in: UserCreate,
    db: Session = Depends(get_db)
) -> Any:
    """
    Crée un nouvel utilisateur.
    """
    # Vérifier si l'email est déjà utilisé
    db_user = UserService.get_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cet email est déjà utilisé"
        )
    
    # Créer l'utilisateur
    user = UserService.create_user(db=db, user_in=user_in)
    
    # Retourner l'utilisateur créé (sans le mot de passe)
    return user

@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
async def login(
    request: Request, 
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    Authentifie un utilisateur et renvoie un token JWT.
    """
    # Authentifier l'utilisateur
    user = auth_service.authenticate_user(
        db=db, 
        email=form_data.username, 
        password=form_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Vérifier si l'utilisateur est actif
    if not UserService.is_active(user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Compte utilisateur inactif"
        )
    
    # Créer le token d'accès
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/refresh-token", response_model=Token)
async def refresh_token(
    current_user: User = Depends(auth_service.get_current_active_user),
) -> Any:
    """
    Rafraîchit un token JWT expiré.
    """
    # Créer un nouveau token d'accès
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": current_user.email}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserSchema)
async def read_users_me(
    current_user: User = Depends(auth_service.get_current_active_user),
) -> Any:
    """
    Récupère les informations de l'utilisateur connecté.
    """
    return current_user
