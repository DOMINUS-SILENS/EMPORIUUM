from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api import deps
from src.models import User
from src.models.user_preferences import UserPreferences, UserPreferencesUpdate
from src.services.user_preferences_service import user_preferences_service

router = APIRouter()


@router.get("/", response_model=UserPreferences)
def get_user_preferences(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_acheteur),
):
    """Retrieve the current user's catalog preferences."""
    return user_preferences_service.get_or_create(db, user=current_user)


@router.put("/", response_model=UserPreferences)
def update_user_preferences(
    *, 
    db: Session = Depends(deps.get_db),
    preferences_in: UserPreferencesUpdate,
    current_user: User = Depends(deps.get_current_active_acheteur),
):
    """Update the current user's catalog preferences."""
    preferences = user_preferences_service.get_or_create(db, user=current_user)
    return user_preferences_service.update(db, db_obj=preferences, obj_in=preferences_in)
