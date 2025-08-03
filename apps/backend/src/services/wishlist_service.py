from typing import Optional
from sqlalchemy.orm import Session

from src.models.wishlist import WishlistDB, WishlistItemDB, WishlistItemCreate
from src.models.user import User
from src.services.product_service import product_service

class WishlistService:
    def get_or_create_wishlist(self, db: Session, *, user: User) -> WishlistDB:
        """Retrieve a user's wishlist, creating one if it doesn't exist."""
        wishlist = db.query(WishlistDB).filter(WishlistDB.user_id == user.id).first()
        if not wishlist:
            wishlist = WishlistDB(user_id=user.id)
            db.add(wishlist)
            db.commit()
            db.refresh(wishlist)
        return wishlist

    def add_item_to_wishlist(self, db: Session, *, wishlist: WishlistDB, item_in: WishlistItemCreate) -> WishlistDB:
        """Add a product to the user's wishlist."""
        # Check if product exists
        product = product_service.get(db, id=item_in.product_id)
        if not product:
            raise ValueError("Product not found")

        # Check if item is already in wishlist
        existing_item = (
            db.query(WishlistItemDB)
            .filter(
                WishlistItemDB.wishlist_id == wishlist.id,
                WishlistItemDB.product_id == item_in.product_id,
            )
            .first()
        )
        if existing_item:
            return wishlist # Or raise an error, depending on desired behavior

        db_item = WishlistItemDB(
            wishlist_id=wishlist.id, 
            product_id=item_in.product_id
        )
        db.add(db_item)
        db.commit()
        db.refresh(wishlist)
        return wishlist

    def remove_item_from_wishlist(self, db: Session, *, wishlist: WishlistDB, product_id: int) -> WishlistDB:
        """Remove a product from the user's wishlist."""
        item_to_remove = (
            db.query(WishlistItemDB)
            .filter(
                WishlistItemDB.wishlist_id == wishlist.id,
                WishlistItemDB.product_id == product_id,
            )
            .first()
        )

        if not item_to_remove:
            raise ValueError("Item not found in wishlist")

        db.delete(item_to_remove)
        db.commit()
        db.refresh(wishlist)
        return wishlist

wishlist_service = WishlistService()
