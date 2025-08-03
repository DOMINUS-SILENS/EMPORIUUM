from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.api import deps
from src.models.user import User, UserRole
from src.schemas.user import User as UserSchema, UserCreate, UserUpdate
from src.services.user_service import UserService
from src.services.order_service import order_service
from src.schemas.order import Order as OrderSchema

router = APIRouter()

def get_db_superuser(db: Session = Depends(deps.get_db)):
    user = deps.get_current_active_superuser()
    return db, user

def get_db_current_user(db: Session = Depends(deps.get_db)):
    user = deps.get_current_user()
    return db, user

@router.get("/", response_model=List[UserSchema])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    role: Optional[UserRole] = None,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """Retrieve users, with optional filtering by role."""
    users = UserService.get_users(db, skip=skip, limit=limit, role=role)
    return users

@router.post("/", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """Create new user (admin only)."""
    user = UserService.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = UserService.create_user(db=db, user_in=user_in)
    return user

@router.get("/{user_id}", response_model=UserSchema)
def read_user(
    user_id: int,
    db_user: tuple = Depends(get_db_current_user),
) -> Any:
    """
    Get user by ID.
    A user can only see their own profile, unless they are an admin.
    """
    db, current_user = db_user
    user = UserService.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.id != user.id and not UserService.is_superuser(current_user):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return user

@router.put("/{user_id}", response_model=UserSchema)
def update_user(
    *,
    db_user: tuple = Depends(get_db_current_user),
    user_id: int,
    user_in: UserUpdate,
) -> Any:
    """
    Update a user.
    A user can only update their own profile, unless they are an admin.
    """
    db, current_user = db_user
    db_user = UserService.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system",
        )

    if current_user.id != db_user.id and not UserService.is_superuser(current_user):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Check for email conflicts
    if user_in.email and user_in.email != db_user.email:
        existing_user = UserService.get_user_by_email(db, email=user_in.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=400, detail="Email already registered by another user."
            )

    user_updated = UserService.update_user(
        db=db, db_user=db_user, user_in=user_in, update_password=bool(user_in.password)
    )
    return user_updated

@router.delete("/{user_id}", response_model=UserSchema)
def delete_user(
    *,
    db_user: tuple = Depends(get_db_superuser),
    user_id: int,
) -> Any:
    """
    Delete a user.
    Only admins can delete users.
    """
    db, current_user = db_user
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Admins cannot delete themselves.")
    
    user = UserService.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return UserService.delete_user(db=db, user_id=user_id)

@router.get("/{user_id}/orders", response_model=List[OrderSchema])
def read_user_orders(
    user_id: int,
    db_user: tuple = Depends(get_db_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve order history for a specific user.
    A user can only see their own orders, unless they are an admin.
    """
    db, current_user = db_user
    if current_user.id != user_id and not UserService.is_superuser(current_user):
        raise HTTPException(
            status_code=403, detail="Not enough permissions"
        )

    orders = order_service.get_multi_by_buyer(
        db, buyer_id=user_id, skip=skip, limit=limit
    )
    return orders
