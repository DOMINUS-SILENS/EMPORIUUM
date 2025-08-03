from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api import deps
from src.models import User
from src.services.payment_service import payment_service
from src.services.order_service import order_service # Using order_service to fetch purchase

router = APIRouter()


@router.post("/create-payment-intent/{purchase_id}", response_model=dict)
def create_payment_intent(
    *, 
    db: Session = Depends(deps.get_db),
    purchase_id: int,
    current_user: User = Depends(deps.get_current_active_user) # Any authenticated user can pay
):
    """Create a Stripe Payment Intent for a purchase."""
    # Fetch the purchase and ensure it belongs to the current user
    purchase = db.query(PurchaseDB).filter(PurchaseDB.id == purchase_id, PurchaseDB.buyer_id == current_user.id).first()

    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found or access denied")

    try:
        client_secret = payment_service.create_payment_intent(db, purchase=purchase)
        return {"clientSecret": client_secret}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred while creating the payment intent.")

# Need to import PurchaseDB for the query
from src.models import PurchaseDB
