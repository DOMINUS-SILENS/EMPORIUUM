from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from backend.models.user import User
from backend.models.product import Product, ProductDB
from backend.models.purchase import PurchaseDB, Purchase
from backend.models.db import get_db
from backend.services.auth import get_current_user
from sqlalchemy.orm import Session, joinedload
from typing import List

router = APIRouter(tags=["Acheteur"])

def acheteur_required(current_user: User = Depends(get_current_user)):
    if current_user.role != "acheteur":
        raise HTTPException(status_code=403, detail="Acheteur access required")
    return current_user

@router.get(
    "/boutique",
    summary="Acheteur dashboard",
    description="Get dashboard info for acheteur.",
    tags=["Acheteur"],
    responses={200: {"description": "Dashboard info", "content": {"application/json": {"example": {"message": "Acheteur dashboard"}}}}}
)
def get_acheteur_dashboard():
    return {"message": "Acheteur dashboard"}

@router.get(
    "/products",
    response_model=List[Product],
    summary="List products",
    description="List all available products for acheteur.",
    tags=["Acheteur"],
    responses={
        200: {"description": "List of products", "content": {"application/json": {"example": [{"id": 1, "name": "Produit A", "price": 10.0, "vendeur_id": 2}]}}}
    }
)
def list_products(current_user: User = Depends(acheteur_required), db: Session = Depends(get_db)):
    return db.query(ProductDB).all()

@router.post(
    "/buy/{product_id}",
    response_model=Purchase,
    summary="Buy a product",
    description="Acheteur buys a product. Cannot buy the same product twice.",
    tags=["Acheteur"],
    responses={
        200: {"description": "Purchase successful", "content": {"application/json": {"example": {"id": 1, "user_id": 3, "product_id": 1}}}},
        400: {"description": "Already purchased or invalid", "content": {"application/json": {"example": {"detail": "You have already purchased this product."}}}},
        404: {"description": "Product not found", "content": {"application/json": {"example": {"detail": "Product not found"}}}}
    }
)
def buy_product(product_id: int, current_user: User = Depends(acheteur_required), db: Session = Depends(get_db)):
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    # Business rule: cannot buy the same product twice
    existing = db.query(PurchaseDB).filter(PurchaseDB.user_id == current_user.id, PurchaseDB.product_id == product_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already purchased this product.")
    purchase = PurchaseDB(user_id=current_user.id, product_id=product_id)
    db.add(purchase)
    db.commit()
    db.refresh(purchase)
    return purchase

@router.get(
    "/purchases",
    response_model=List[Purchase],
    summary="List purchases",
    description="List all purchases for the current acheteur user. Forbidden to list purchases of another user.",
    tags=["Acheteur"],
    responses={
        200: {"description": "List of purchases", "content": {"application/json": {"example": [{"id": 1, "user_id": 3, "product_id": 1}]}}},
        403: {"description": "Forbidden", "content": {"application/json": {"example": {"detail": "Forbidden: cannot list purchases of another user."}}}}
    }
)
def list_purchases(current_user: User = Depends(acheteur_required), db: Session = Depends(get_db)):
    # Business rule: acheteur can only list their own purchases (already enforced by dependency)
    purchases = db.query(PurchaseDB).options(joinedload(PurchaseDB.product_id)).filter(PurchaseDB.user_id == current_user.id).all()
    return purchases 