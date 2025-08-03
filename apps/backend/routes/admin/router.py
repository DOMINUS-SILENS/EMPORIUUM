import os
import sys
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List

# Use relative imports
from ....models.user import User, UserCreate, UserDB
from ....models.product import ProductDB
from ....models.purchase import PurchaseDB, Purchase
from ....models.db import get_db
from ....services.auth import get_current_user, hash_password

router = APIRouter(tags=["Admin"])

def admin_required(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get(
    "/dashboard",
    summary="Admin dashboard",
    description="Get dashboard info for admin.",
    tags=["Admin"],
    responses={200: {"description": "Dashboard info", "content": {"application/json": {"example": {"message": "Admin dashboard"}}}}}
)
def get_admin_dashboard():
    return {"message": "Admin dashboard"}

@router.get(
    "/users",
    response_model=List[User],
    summary="List users",
    description="List all users in the system.",
    tags=["Admin"],
    responses={200: {"description": "List of users", "content": {"application/json": {"example": [{"id": 1, "name": "Admin", "email": "admin@example.com", "role": "admin"}]}}}}
)
def list_users(current_user: User = Depends(admin_required), db: Session = Depends(get_db)):
    users = db.query(UserDB).all()
    return users

@router.get(
    "/users/{user_id}",
    response_model=User,
    summary="Get user",
    description="Get a user by ID.",
    tags=["Admin"],
    responses={
        200: {"description": "User found", "content": {"application/json": {"example": {"id": 1, "name": "Admin", "email": "admin@example.com", "role": "admin"}}}},
        404: {"description": "User not found", "content": {"application/json": {"example": {"detail": "User not found"}}}}
    }
)
def get_user(user_id: int, current_user: User = Depends(admin_required), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post(
    "/users",
    response_model=User,
    summary="Create user",
    description="Create a new user.",
    tags=["Admin"],
    responses={
        200: {"description": "User created", "content": {"application/json": {"example": {"id": 1, "name": "Admin", "email": "admin@example.com", "role": "admin"}}}},
        400: {"description": "Email already registered", "content": {"application/json": {"example": {"detail": "Email already registered"}}}}
    }
)
def create_user(user: UserCreate, current_user: User = Depends(admin_required), db: Session = Depends(get_db)):
    if db.query(UserDB).filter(UserDB.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user.password)
    db_user = UserDB(name=user.name, email=user.email, role=user.role, password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put(
    "/users/{user_id}",
    response_model=User,
    summary="Update user",
    description="Update a user by ID. Admin cannot update another admin's role to non-admin.",
    tags=["Admin"],
    responses={
        200: {"description": "User updated", "content": {"application/json": {"example": {"id": 1, "name": "Admin", "email": "admin@example.com", "role": "admin"}}}},
        400: {"description": "Cannot demote another admin", "content": {"application/json": {"example": {"detail": "Cannot update another admin's role to non-admin."}}}},
        404: {"description": "User not found", "content": {"application/json": {"example": {"detail": "User not found"}}}}
    }
)
def update_user(user_id: int, user: UserCreate, current_user: User = Depends(admin_required), db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    # Business rule: admin cannot update another admin's role to non-admin
    if db_user.role == "admin" and user.role != "admin" and db_user.id != current_user.id:
        raise HTTPException(status_code=400, detail="Cannot update another admin's role to non-admin.")
    for key, value in user.dict().items():
        if key == "password":
            value = hash_password(value)
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete(
    "/users/{user_id}",
    summary="Delete user",
    description="Delete a user by ID. Admin cannot delete themselves.",
    tags=["Admin"],
    responses={
        200: {"description": "User deleted", "content": {"application/json": {"example": {"detail": "User deleted"}}}},
        400: {"description": "Cannot delete self", "content": {"application/json": {"example": {"detail": "Admin cannot delete themselves."}}}},
        404: {"description": "User not found", "content": {"application/json": {"example": {"detail": "User not found"}}}}
    }
)
def delete_user(user_id: int, current_user: User = Depends(admin_required), db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if db_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Admin cannot delete themselves.")
    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted"}

@router.get(
    "/purchases",
    response_model=List[Purchase],
    summary="List all purchases",
    description="List all purchases in the system.",
    tags=["Admin"],
    responses={200: {"description": "List of purchases", "content": {"application/json": {"example": [{"id": 1, "user_id": 3, "product_id": 1}]}}}}
)
def list_all_purchases(current_user: User = Depends(admin_required), db: Session = Depends(get_db)):
    purchases = db.query(PurchaseDB).all()
    return purchases 