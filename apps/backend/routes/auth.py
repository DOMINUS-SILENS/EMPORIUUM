from fastapi import APIRouter, Depends, HTTPException, Request, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import secrets
import string

# Importations absolues
from backend.services.auth import authenticate_user, create_access_token, create_user
from backend.models.db import get_db
from backend.models.user import UserCreate, UserDB
from py_common.validators import validate_password_strength, hash_password

# Pour l'envoi d'emails (à implémenter)
# from backend.utils.email import send_confirmation_email

router = APIRouter(tags=["Auth"])

@router.post(
    "/token",
    summary="Login and get JWT token",
    description="Authenticate user and return a JWT access token.",
    tags=["Auth"],
    responses={
        200: {"description": "Token issued", "content": {"application/json": {"example": {"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "token_type": "bearer"}}}},
        400: {"description": "Invalid credentials", "content": {"application/json": {"example": {"detail": "Incorrect username or password"}}}}
    },
    response_model=None
)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(
        data=user.dict(),
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer"}

def generate_confirmation_token(length: int = 32) -> str:
    """Génère un jeton de confirmation aléatoire"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

@router.post(
    "/register",
    summary="Register new user",
    description="""
    Crée un nouveau compte utilisateur et renvoie un token JWT.
    
    Validation des mots de passe :
    - Au moins 8 caractères
    - Au moins une lettre minuscule
    - Au moins une lettre majuscule
    - Au moins un chiffre
    - Au moins un caractère spécial
    """,
    tags=["Auth"],
    responses={
        201: {"description": "User created", "content": {"application/json": {"example": {"message": "Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte."}}}},
        400: {"description": "Registration failed", "content": {"application/json": {"example": {"detail": "Email already registered"}}}}
    },
    response_model=None
)
async def register_user(
    user_data: UserCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    print(f"🔍 Données reçues pour l'inscription : {user_data}")
    try:
        # Validation avancée du mot de passe
        validate_password_strength(user_data.password)
        
        # Vérifier si l'utilisateur existe déjà
        existing_user = db.query(UserDB).filter(UserDB.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un compte avec cet email existe déjà"
            )
        
        # Générer un jeton de confirmation
        confirmation_token = generate_confirmation_token()
        
        # Hacher le mot de passe
        hashed_password = hash_password(user_data.password)
        
        # Créer l'utilisateur avec le mot de passe haché
        user = create_user(
            user_data.copy(update={"password": hashed_password}), 
            db
        )
        
        # Envoyer l'email de confirmation (en arrière-plan)
        # background_tasks.add_task(
        #     send_confirmation_email,
        #     email=user.email,
        #     username=user.full_name,
        #     confirmation_token=confirmation_token
        # )
        
        # Pour le moment, on renvoie une réponse de succès sans token
        # Le token ne sera envoyé qu'après confirmation de l'email
        return {
            "message": "Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "is_active": False  # L'utilisateur doit confirmer son email
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))