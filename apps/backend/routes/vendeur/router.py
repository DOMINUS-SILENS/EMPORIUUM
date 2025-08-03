from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from backend.models.user import User
from backend.models.product import Product, ProductCreate, ProductDB
from backend.models.purchase import PurchaseDB, Purchase
from backend.models.db import get_db
from backend.services.auth import get_current_user
from sqlalchemy.orm import Session, joinedload
from typing import List

router = APIRouter(tags=["Vendeur"])

def vendeur_required(current_user: User = Depends(get_current_user)):
    if current_user.role != "vendeur":
        raise HTTPException(status_code=403, detail="Vendeur access required")
    return current_user

@router.get(
    "/vendre",
    summary="Vendeur dashboard",
    description="Get dashboard info for vendeur.",
    tags=["Vendeur"],
    responses={200: {"description": "Dashboard info", "content": {"application/json": {"example": {"message": "Vendeur dashboard"}}}}}
)
def get_vendeur_dashboard():
    return {"message": "Vendeur dashboard"}

@router.get(
    "/products",
    response_model=List[Product],
    summary="List products",
    description="List all products for the current vendeur.",
    tags=["Vendeur"],
    responses={
        200: {"description": "List of products", "content": {"application/json": {"example": [{"id": 1, "name": "Produit A", "price": 10.0, "vendeur_id": 2}]}}}
    }
)
def list_products(current_user: User = Depends(vendeur_required), db: Session = Depends(get_db)):
    return db.query(ProductDB).filter(ProductDB.vendeur_id == current_user.id).all()

@router.get(
    "/products/{product_id}",
    response_model=Product,
    summary="Get product",
    description="Get a product by ID for the current vendeur.",
    tags=["Vendeur"],
    responses={
        200: {"description": "Product found", "content": {"application/json": {"example": {"id": 1, "name": "Produit A", "price": 10.0, "vendeur_id": 2}}}},
        404: {"description": "Product not found", "content": {"application/json": {"example": {"detail": "Product not found"}}}}
    }
)
def get_product(product_id: int, current_user: User = Depends(vendeur_required), db: Session = Depends(get_db)):
    product = db.query(ProductDB).filter(ProductDB.id == product_id, ProductDB.vendeur_id == current_user.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post(
    "/products",
    response_model=Product,
    summary="Create product",
    description="Create a new product. Cannot create two products with the same name.",
    tags=["Vendeur"],
    responses={
        200: {"description": "Product created", "content": {"application/json": {"example": {"id": 1, "name": "Produit A", "price": 10.0, "vendeur_id": 2}}}},
        400: {"description": "Duplicate product name", "content": {"application/json": {"example": {"detail": "You already have a product with this name."}}}}
    }
)
def create_product(product: ProductCreate, current_user: User = Depends(vendeur_required), db: Session = Depends(get_db)):
    # Business rule: unique product name per vendeur
    existing = db.query(ProductDB).filter(ProductDB.vendeur_id == current_user.id, ProductDB.name == product.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have a product with this name.")
    db_product = ProductDB(**product.dict(), vendeur_id=current_user.id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put(
    "/products/{product_id}",
    response_model=Product,
    summary="Update product",
    description="Update a product by ID for the current vendeur. Cannot update another vendeur's product.",
    tags=["Vendeur"],
    responses={
        200: {"description": "Product updated", "content": {"application/json": {"example": {"id": 1, "name": "Produit A", "price": 10.0, "vendeur_id": 2}}}},
        403: {"description": "Forbidden", "content": {"application/json": {"example": {"detail": "You cannot update another vendeur's product."}}}},
        404: {"description": "Product not found", "content": {"application/json": {"example": {"detail": "Product not found"}}}}
    }
)
def update_product(product_id: int, product: ProductCreate, current_user: User = Depends(vendeur_required), db: Session = Depends(get_db)):
    db_product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    if db_product.vendeur_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot update another vendeur's product.")
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete(
    "/products/{product_id}",
    summary="Delete product",
    description="Delete a product by ID for the current vendeur. Cannot delete another vendeur's product.",
    tags=["Vendeur"],
    responses={
        200: {"description": "Product deleted", "content": {"application/json": {"example": {"detail": "Product deleted"}}}},
        403: {"description": "Forbidden", "content": {"application/json": {"example": {"detail": "You cannot delete another vendeur's product."}}}},
        404: {"description": "Product not found", "content": {"application/json": {"example": {"detail": "Product not found"}}}}
    }
)
def delete_product(product_id: int, current_user: User = Depends(vendeur_required), db: Session = Depends(get_db)):
    db_product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    if db_product.vendeur_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot delete another vendeur's product.")
    db.delete(db_product)
    db.commit()
    return {"detail": "Product deleted"}

@router.get(
    "/purchases",
    response_model=List[Purchase],
    summary="List purchases",
    description="List all purchases for the current vendeur's products.",
    tags=["Vendeur"],
    responses={
        200: {"description": "List of purchases", "content": {"application/json": {"example": [{"id": 1, "user_id": 3, "product_id": 1}]}}}
    }
)
def list_purchases(current_user: User = Depends(vendeur_required), db: Session = Depends(get_db)):
    purchases = db.query(PurchaseDB).options(joinedload(PurchaseDB.product)).join(ProductDB).filter(ProductDB.vendeur_id == current_user.id).all()
    return purchases 