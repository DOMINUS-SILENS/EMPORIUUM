from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api import deps
from src.db.models import User
from src.schemas import UserUpdate, PasswordUpdate
from src.services.user_service import user_service
from src.core.security import get_password_hash
from src.models.setting import Setting, SettingCreate, SettingUpdate
from src.services.setting_service import setting_service

router = APIRouter()


@router.put("/profile", response_model=User)
def update_profile(
    *, 
    db: Session = Depends(deps.get_db),
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Update the current seller's profile."""
    user = user_service.update(db, db_obj=current_user, obj_in=user_in)
    return user


@router.put("/password")
def update_password(
    *, 
    db: Session = Depends(deps.get_db),
    password_in: PasswordUpdate,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Update the current seller's password."""
    if not user_service.authenticate(db, email=current_user.email, password=password_in.old_password):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    
    hashed_password = get_password_hash(password_in.new_password)
    current_user.hashed_password = hashed_password
    db.add(current_user)
    db.commit()
    
    return {"message": "Password updated successfully"}


# Admin Site Settings


@router.get("/admin/settings/", response_model=List[Setting])
def read_settings_admin(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
):
    """Retrieve all settings as an admin."""
    return setting_service.get_multi(db)


@router.post("/admin/settings/", response_model=Setting)
def create_setting_admin(
    *,
    db: Session = Depends(deps.get_db),
    setting_in: SettingCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
):
    """Create a new setting as an admin."""
    existing_setting = setting_service.get_by_key(db, key=setting_in.key)
    if existing_setting:
        raise HTTPException(
            status_code=400,
            detail=f"Setting with key '{setting_in.key}' already exists.",
        )
    return setting_service.create(db, obj_in=setting_in)


@router.get("/admin/settings/{key}", response_model=Setting)
def read_setting_admin(
    *,
    db: Session = Depends(deps.get_db),
    key: str,
    current_user: User = Depends(deps.get_current_active_superuser),
):
    """Get a specific setting by key as an admin."""
    setting = setting_service.get_by_key(db, key=key)
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting


@router.put("/admin/settings/{key}", response_model=Setting)
def update_setting_admin(
    *,
    db: Session = Depends(deps.get_db),
    key: str,
    setting_in: SettingUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
):
    """Update a setting as an admin."""
    setting = setting_service.get_by_key(db, key=key)
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting_service.update(db, db_obj=setting, obj_in=setting_in)


@router.delete("/admin/settings/{key}", response_model=Setting)
def delete_setting_admin(
    *,
    db: Session = Depends(deps.get_db),
    key: str,
    current_user: User = Depends(deps.get_current_active_superuser),
):
    """Delete a setting as an admin."""
    setting = setting_service.get_by_key(db, key=key)
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting_service.remove(db, id=setting.id)
