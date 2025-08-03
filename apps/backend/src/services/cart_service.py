from typing import Optional
from sqlalchemy.orm import Session

from src.models.cart import CartDB, CartItemDB, CartItemCreate, CartItemUpdate
from src.models.user import User
from src.services.base_service import BaseService

class CartService(BaseService[CartDB, None, None]):
    def get_by_user(self, db: Session, *, user: User) -> Optional[CartDB]:
        return db.query(CartDB).filter(CartDB.user_id == user.id).first()

    def create_for_user(self, db: Session, *, user: User) -> CartDB:
        db_cart = CartDB(user_id=user.id)
        db.add(db_cart)
        db.commit()
        db.refresh(db_cart)
        return db_cart

    def add_item(self, db: Session, *, cart: CartDB, item_in: CartItemCreate) -> CartDB:
        # Check if item already exists in cart
        db_item = db.query(CartItemDB).filter(
            CartItemDB.cart_id == cart.id, 
            CartItemDB.product_id == item_in.product_id
        ).first()

        if db_item:
            # Update quantity
            db_item.quantity += item_in.quantity
        else:
            # Add new item
            db_item = CartItemDB(**item_in.dict(), cart_id=cart.id)
            db.add(db_item)
        
        db.commit()
        db.refresh(cart)
        return cart

    def update_item_quantity(self, db: Session, *, cart: CartDB, item_id: int, item_in: CartItemUpdate) -> Optional[CartDB]:
        db_item = db.query(CartItemDB).filter(
            CartItemDB.id == item_id, 
            CartItemDB.cart_id == cart.id
        ).first()

        if db_item:
            db_item.quantity = item_in.quantity
            db.commit()
            db.refresh(cart)
            return cart
        return None

    def remove_item(self, db: Session, *, cart: CartDB, item_id: int) -> Optional[CartDB]:
        db_item = db.query(CartItemDB).filter(
            CartItemDB.id == item_id, 
            CartItemDB.cart_id == cart.id
        ).first()

        if db_item:
            db.delete(db_item)
            db.commit()
            db.refresh(cart)
            return cart
        return None

    def clear_cart(self, db: Session, *, cart: CartDB) -> CartDB:
        """Deletes all items from the user's cart."""
        for item in list(cart.items):
            db.delete(item)
        db.commit()
        db.refresh(cart)
        return cart

cart_service = CartService(CartDB)
