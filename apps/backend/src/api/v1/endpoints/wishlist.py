from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.api import deps
from src.models import User
from src.models.wishlist import Wishlist, WishlistItemCreate
from src.services.wishlist_service import wishlist_service

router = APIRouter()


@router.get("/", response_model=Wishlist)
def get_user_wishlist(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_acheteur),
):
    """Retrieve the current user's wishlist."""
    return wishlist_service.get_or_create_wishlist(db, user=current_user)


@router.post("/items", response_model=Wishlist)
def add_item_to_wishlist(
    *, 
    db: Session = Depends(deps.get_db),
    item_in: WishlistItemCreate,
    current_user: User = Depends(deps.get_current_active_acheteur),
):
    """Add an item to the current user's wishlist."""
    wishlist = wishlist_service.get_or_create_wishlist(db, user=current_user)
    try:
        return wishlist_service.add_item_to_wishlist(db, wishlist=wishlist, item_in=item_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/items/{product_id}", response_model=Wishlist)
def remove_item_from_wishlist(
    product_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_acheteur),
):
    """Remove an item from the current user's wishlist."""
    wishlist = wishlist_service.get_or_create_wishlist(db, user=current_user)
    try:
        return wishlist_service.remove_item_from_wishlist(db, wishlist=wishlist, product_id=product_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
