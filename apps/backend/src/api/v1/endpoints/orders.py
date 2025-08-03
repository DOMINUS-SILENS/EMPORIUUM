from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.api import deps
from src.models import Purchase, PurchaseUpdate, User
from src.models.purchase import PurchaseStatus
from src.services.order_service import order_service

router = APIRouter()


class OrderStatusUpdate(BaseModel):
    status: PurchaseStatus


@router.get("/", response_model=List[Purchase])
def read_orders(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    status: Optional[PurchaseStatus] = None,
    sort_by: Optional[str] = None,
    sort_order: str = 'desc',
    current_user: User = Depends(deps.get_current_active_vendeur),
):
    """Retrieve orders for the current seller with filtering and sorting."""
    orders = order_service.get_multi_by_seller(
        db, 
        seller=current_user, 
        skip=skip, 
        limit=limit,
        status=status,
        sort_by=sort_by,
        sort_order=sort_order
    )
    return orders


@router.get("/{order_id}", response_model=Purchase)
def read_order(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    current_user: User = Depends(deps.get_current_active_vendeur),
):
    """Get a specific order by ID for the current seller."""
    order = order_service.get_order_for_seller(
        db, seller=current_user, order_id=order_id
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/{order_id}", response_model=Purchase)
def update_order(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    order_in: PurchaseUpdate,
    current_user: User = Depends(deps.get_current_active_vendeur),
):
    """Update an order for the current seller."""
    order = order_service.get_order_for_seller(
        db, seller=current_user, order_id=order_id
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order = order_service.update(db, db_obj=order, obj_in=order_in)
    return order


@router.get("/admin/", response_model=List[Purchase])
def read_orders_admin(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    status: Optional[PurchaseStatus] = None,
    user_id: Optional[int] = None,
    sort_by: Optional[str] = None,
    sort_order: str = 'desc',
    current_user: User = Depends(deps.get_current_active_superuser),
):
    """Retrieve all orders as an admin with filtering and sorting."""
    return order_service.get_all_orders(
        db,
        skip=skip,
        limit=limit,
        status=status,
        user_id=user_id,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.get("/admin/{order_id}", response_model=Purchase)
def read_order_admin(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    current_user: User = Depends(deps.get_current_active_superuser),
):
    """Get a specific order by ID as an admin."""
    order = order_service.get(db, id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/admin/{order_id}/status", response_model=Purchase)
def update_order_status_admin(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    status_in: OrderStatusUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
):
    """Update an order's status as an admin."""
    order = order_service.get(db, id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_service.update_order_status(
        db, order=order, new_status=status_in.status
    )
