from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api import deps
from src.models import Product, ProductCreate, ProductCreateAdmin, ProductUpdate, User
from src.services.product_service import product_service

router = APIRouter()


@router.get("/public/", response_model=List[Product])
def read_public_products(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = None,
    sort_order: str = 'asc',
):
    """Retrieve all products with optional filtering and sorting."""
    return product_service.get_multi(
        db,
        skip=skip,
        limit=limit,
        category=category,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.get("/public/{product_id}", response_model=Product)
def read_public_product(
    *, 
    db: Session = Depends(deps.get_db),
    product_id: int
):
    """Get a specific product by ID."""
    product = product_service.get(db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/admin/", response_model=Product)
def create_product_admin(
    *,
    db: Session = Depends(deps.get_db),
    product_in: ProductCreateAdmin,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    """Create new product as an admin for a specific seller."""
    return product_service.create_by_admin(db, obj_in=product_in)


@router.get("/admin/", response_model=List[Product])
def read_products_admin(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = None,
    sort_order: str = 'asc',
    current_user: User = Depends(deps.get_current_active_superuser)
):
    """Retrieve all products as an admin with optional filtering and sorting."""
    return product_service.get_multi(
        db,
        skip=skip,
        limit=limit,
        category=category,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.get("/admin/{product_id}", response_model=Product)
def read_product_admin(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    """Get a specific product by ID as an admin."""
    product = product_service.get(db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/admin/{product_id}", response_model=Product)
def update_product_admin(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    product_in: ProductUpdate,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    """Update a product as an admin."""
    product = product_service.get(db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_service.update(db, db_obj=product, obj_in=product_in)


@router.delete("/admin/{product_id}", response_model=Product)
def delete_product_admin(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    """Delete a product as an admin."""
    product = product_service.get(db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_service.remove(db, id=product_id)


@router.post("/", response_model=Product)
def create_product(
    *, 
    db: Session = Depends(deps.get_db),
    product_in: ProductCreate,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Create new product for the current seller."""
    return product_service.create_with_seller(db, obj_in=product_in, seller=current_user)


@router.get("/", response_model=List[Product])
def read_products(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = None,
    sort_order: str = 'asc',
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Retrieve products for the current seller with optional filtering and sorting."""
    return product_service.get_multi_by_seller(
        db, 
        seller=current_user, 
        skip=skip, 
        limit=limit,
        category=category,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        sort_order=sort_order
    )


@router.get("/{product_id}", response_model=Product)
def read_product(
    *, 
    db: Session = Depends(deps.get_db),
    product_id: int,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Get a specific product by ID for the current seller."""
    product = product_service.get(db, id=product_id)
    if not product or product.seller_id != current_user.id:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=Product)
def update_product(
    *, 
    db: Session = Depends(deps.get_db),
    product_id: int,
    product_in: ProductUpdate,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Update a product for the current seller."""
    product = product_service.get(db, id=product_id)
    if not product or product.seller_id != current_user.id:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_service.update(db, db_obj=product, obj_in=product_in)


@router.delete("/{product_id}", response_model=Product)
def delete_product(
    *, 
    db: Session = Depends(deps.get_db),
    product_id: int,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Delete a product for the current seller."""
    product = product_service.get(db, id=product_id)
    if not product or product.seller_id != current_user.id:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_service.remove(db, id=product_id)
