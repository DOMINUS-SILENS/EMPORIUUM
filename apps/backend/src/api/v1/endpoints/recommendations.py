from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api import deps
from src.models import User, Product
from src.services.recommendation_service import recommendation_service

router = APIRouter()


@router.get("/", response_model=List[Product])
def get_recommendations(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_acheteur),
    limit: int = 10,
):
    """Get product recommendations for the current user."""
    return recommendation_service.get_recommendations_for_user(
        db, user=current_user, limit=limit
    )
