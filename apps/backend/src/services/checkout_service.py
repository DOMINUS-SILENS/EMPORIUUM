from typing import List
from sqlalchemy.orm import Session

from src.models import CartDB, PurchaseCreate, ProductDB, User
from src.services.order_service import order_service

class CheckoutService:
    def create_purchases_from_cart(self, db: Session, *, user: User, cart: CartDB) -> List[PurchaseCreate]:
        """
        Creates purchase records from cart items but does not commit them.
        This is the first step in the checkout process.
        """
        if not cart.items:
            raise ValueError("Cannot checkout with an empty cart.")

        purchases_to_create = []
        for item in cart.items:
            product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
            if not product:
                # In a real app, you might want to handle this more gracefully
                raise ValueError(f"Product with ID {item.product_id} not found.")

            purchase_in = PurchaseCreate(
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=product.price, # Assuming product.price holds the current price
                buyer_id=user.id,
                # Shipping info would likely come from the user's profile or a form
                shipping_address=user.profile.address if hasattr(user, 'profile') else 'Default Address',
                shipping_city=user.profile.city if hasattr(user, 'profile') else 'Default City',
                shipping_postal_code=user.profile.postal_code if hasattr(user, 'profile') else '00000',
                shipping_country=user.profile.country if hasattr(user, 'profile') else 'Default Country',
            )
            purchases_to_create.append(purchase_in)
        
        return purchases_to_create

checkout_service = CheckoutService()
