from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api import deps
from src.models import User
from src.models.rewards import LoyaltyAccount
from src.services.rewards_service import rewards_service

router = APIRouter()


@router.get("/account", response_model=LoyaltyAccount)
def read_loyalty_account(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_acheteur),
):
    """Retrieve the current user's loyalty account and transaction history."""
    account = rewards_service.get_or_create_account(db, user=current_user)
    return account
