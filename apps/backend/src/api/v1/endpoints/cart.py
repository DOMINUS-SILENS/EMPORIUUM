from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from src.api import deps
from src.models.cart import Cart, CartItemCreate, CartItemUpdate
from src.models.user import User
from src.services.cart_service import cart_service

router = APIRouter()


@router.get("/", response_model=Cart)
def read_cart(db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_acheteur)):
    """Retrieve the current user's shopping cart."""
    cart = cart_service.get_by_user(db, user=current_user)
    if not cart:
        cart = cart_service.create_for_user(db, user=current_user)
    return cart


@router.post("/items/", response_model=Cart)
def add_item_to_cart(
    *, 
    db: Session = Depends(deps.get_db), 
    item_in: CartItemCreate, 
    current_user: User = Depends(deps.get_current_active_acheteur)
):
    """Add an item to the shopping cart."""
    cart = cart_service.get_by_user(db, user=current_user)
    if not cart:
        cart = cart_service.create_for_user(db, user=current_user)
    return cart_service.add_item(db, cart=cart, item_in=item_in)


@router.put("/items/{item_id}", response_model=Cart)
def update_cart_item(
    *, 
    db: Session = Depends(deps.get_db), 
    item_id: int, 
    item_in: CartItemUpdate, 
    current_user: User = Depends(deps.get_current_active_acheteur)
):
    """Update an item's quantity in the shopping cart."""
    cart = cart_service.get_by_user(db, user=current_user)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    updated_cart = cart_service.update_item_quantity(db, cart=cart, item_id=item_id, item_in=item_in)
    if not updated_cart:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    return updated_cart


@router.delete("/items/{item_id}", response_model=Cart)
def remove_item_from_cart(
    *, 
    db: Session = Depends(deps.get_db), 
    item_id: int, 
    current_user: User = Depends(deps.get_current_active_acheteur)
):
    """Remove an item from the shopping cart."""
    cart = cart_service.get_by_user(db, user=current_user)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    updated_cart = cart_service.remove_item(db, cart=cart, item_id=item_id)
    if not updated_cart:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    return updated_cart
