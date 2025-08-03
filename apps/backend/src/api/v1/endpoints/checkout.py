from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api import deps
from src.models import User
from src.services.cart_service import cart_service
from src.services.checkout_service import checkout_service
from typing import List
from decimal import Decimal
from pydantic import BaseModel

from src.models import Purchase
from src.services.order_service import order_service
from src.services.payment_service import payment_service

router = APIRouter()


@router.post("/initiate", response_model=dict)
def initiate_checkout(
    *, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_acheteur)
):
    """
    Initiates the checkout process:
    1. Prepares purchase data from the user's cart.
    2. Creates a Stripe Payment Intent for the total amount.
    3. Returns the client_secret to the frontend to complete payment.
    """
    cart = cart_service.get_by_user(db, user=current_user)
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Your cart is empty.")

    try:
        # Step 1: Prepare purchase data (in memory)
        purchases_in = checkout_service.create_purchases_from_cart(db, user=current_user, cart=cart)
        
        # Step 2: Calculate total amount
        total_amount = sum(p.unit_price * p.quantity for p in purchases_in)

        # Step 3: Create a single Payment Intent
        client_secret = payment_service.create_payment_intent_for_checkout(
            purchases=purchases_in, total_amount=total_amount, user_id=current_user.id
        )

        return {"clientSecret": client_secret}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred during checkout.")

class CheckoutCompletePayload(BaseModel):
    payment_intent_id: str


@router.post("/complete", response_model=List[Purchase])
def complete_checkout(
    *,
    db: Session = Depends(deps.get_db),
    payload: CheckoutCompletePayload,
    current_user: User = Depends(deps.get_current_active_acheteur)
):
    """
    Completes the checkout process after successful payment:
    1. Verifies the Stripe Payment Intent.
    2. Creates the purchase records in the database.
    3. Clears the user's shopping cart.
    """
    # Step 1: Verify the payment intent
    is_valid = payment_service.verify_payment_intent(payload.payment_intent_id)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid Payment Intent or payment failed.")

    # Step 2: Get the user's cart
    cart = cart_service.get_by_user(db, user=current_user)
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty. Cannot complete purchase.")

    # Step 3: Create the purchase records
    try:
        created_purchases = order_service.create_purchases_from_cart_after_payment(
            db,
            user=current_user,
            cart=cart,
            payment_intent_id=payload.payment_intent_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Step 4: Clear the cart
    cart_service.clear_cart(db, cart=cart)

    return created_purchases
