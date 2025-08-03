import os
from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

# Import models
from backend.models.user import User
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration de la sécurité
SECRET_KEY = os.getenv("SECRET_KEY", "votre_clé_secrète_très_longue_et_sécurisée")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    payload = decode_access_token(token)
    user = User(**payload)
    return user

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Updated authentication logic to use hashed passwords

def authenticate_user(email: str, password: str, db=None) -> User | None:
    from ..models.user import UserDB
    if db is None:
        return None
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if user and verify_password(password, user.password):
        return User.from_orm(user)
    return None

def create_user(user_data, db) -> User:
    from ..models.user import UserDB, UserCreate
    
    # Check if user already exists
    existing_user = db.query(UserDB).filter(UserDB.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password
    hashed_password = hash_password(user_data.password)
    
    # Create new user in database
    db_user = UserDB(
        email=user_data.email,
        password=hashed_password,
        full_name=user_data.full_name,
        role=user_data.role
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Return User model
    return User.from_orm(db_user)