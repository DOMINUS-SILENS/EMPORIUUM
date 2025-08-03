from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api import deps
from src.models import User
from src.models.store import Store, StoreCreate, StoreUpdate
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
    return store_service.create_with_seller(db, obj_in=store_in, seller=current_user)


@router.get("/me", response_model=Store)
def get_my_store(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Get the current seller's store."""
    store = store_service.get_by_seller(db, seller=current_user)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found for this seller.")
    return store


@router.put("/me", response_model=Store)
def update_my_store(
    *, 
    db: Session = Depends(deps.get_db),
    store_in: StoreUpdate,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Update the current seller's store."""
    store = store_service.get_by_seller(db, seller=current_user)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found. Please create one first.")
    return store_service.update_by_seller(db, db_obj=store, obj_in=store_in, seller=current_user)


@router.get("/{slug}", response_model=Store)
def get_store_by_slug(
    *, 
    db: Session = Depends(deps.get_db),
    slug: str
):
    """Get a store by its public slug."""
    store = store_service.get_by_slug(db, slug=slug)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found.")
    return store
