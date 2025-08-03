from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api import deps
from src.models import User as UserSchema
from src.db.models import User as UserModel
from src.services.client_service import client_service

router = APIRouter()


@router.get("/", response_model=List[UserSchema])
def read_clients(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(deps.get_current_active_vendeur),
):
    """Retrieve clients for the current seller."""
    clients = client_service.get_clients_by_seller(
        db, seller=current_user, skip=skip, limit=limit
    )
    return clients
