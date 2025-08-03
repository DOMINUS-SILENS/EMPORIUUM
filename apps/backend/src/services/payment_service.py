import stripe
from sqlalchemy.orm import Session

from src.core.config import settings
from src.models import PurchaseDB, ProductDB

# Configure Stripe
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY

from typing import List
from decimal import Decimal
from src.models import PurchaseCreate

class PaymentService:
    def create_payment_intent(self, db: Session, *, purchase: PurchaseDB) -> str:
        """
        Create a Stripe Payment Intent for a given purchase.
        Returns the client_secret for the Payment Intent.
        """
        if not stripe.api_key:
            raise ValueError("Stripe API key not configured.")

        product = db.query(ProductDB).filter(ProductDB.id == purchase.product_id).first()
        if not product:
            raise ValueError("Product not found for this purchase.")

        # Amount in the smallest currency unit (e.g., cents for EUR)
        amount = int(purchase.total_price * 100)

        try:
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=settings.STRIPE_CURRENCY or "eur",
                automatic_payment_methods={"enabled": True},
                metadata={
                    "purchase_id": purchase.id,
                    "product_id": product.id,
                    "buyer_id": purchase.buyer_id,
                },
            )
            
            # Save the payment intent ID to the purchase record
            purchase.stripe_payment_intent_id = intent.id
            db.add(purchase)
            db.commit()
            db.refresh(purchase)

            return intent.client_secret
        except Exception as e:
            # In a real app, you'd want more specific error handling
            raise e

    def create_payment_intent_for_checkout(
        self, *, purchases: List[PurchaseCreate], total_amount: Decimal, user_id: int
    ) -> str:
        """
        Create a Stripe Payment Intent for a list of purchases during checkout.
        Returns the client_secret for the Payment Intent.
        """
        if not stripe.api_key:
            raise ValueError("Stripe API key not configured.")

        amount = int(total_amount * 100)  # Amount in cents

        try:
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=settings.STRIPE_CURRENCY or "eur",
                automatic_payment_methods={"enabled": True},
                metadata={
                    "user_id": user_id,
                    "product_ids": ",".join([str(p.product_id) for p in purchases])
                },
            )
            return intent.client_secret
        except Exception as e:
            raise e

    def verify_payment_intent(self, payment_intent_id: str) -> bool:
        """Verifies that a Stripe Payment Intent was successful."""
        if not stripe.api_key:
            raise ValueError("Stripe API key not configured.")
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return intent.status == 'succeeded'
        except Exception as e:
            # Log the error, but return False for security
            print(f"Error verifying payment intent: {e}")
            return False

payment_service = PaymentService()
