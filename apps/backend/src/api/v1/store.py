from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api import deps
from src.models import Store, StoreCreate, StoreUpdate, User
from src.services.store_service import store_service

router = APIRouter()


@router.post("/", response_model=Store)
def create_store(
    *, 
    db: Session = Depends(deps.get_db),
    store_in: StoreCreate,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Create a new store for the current seller."""
    store = store_service.get_by_seller(db, seller_id=current_user.id)
    if store:
        raise HTTPException(
            status_code=400, 
            detail="The seller already has a store."
        )
    return store_service.create_with_seller(db, obj_in=store_in, seller_id=current_user.id)


@router.get("/me", response_model=Store)
def read_store_me(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Get the current seller's store."""
    store = store_service.get_by_seller(db, seller_id=current_user.id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.put("/me", response_model=Store)
def update_store_me(
    *, 
    db: Session = Depends(deps.get_db),
    store_in: StoreUpdate,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Update the current seller's store."""
    store = store_service.get_by_seller(db, seller_id=current_user.id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store_service.update(db, db_obj=store, obj_in=store_in)
