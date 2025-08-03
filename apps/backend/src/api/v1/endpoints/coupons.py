from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api import deps
from typing import Optional

from src.models import Coupon, CouponCreate, CouponCreateAdmin, CouponUpdate, User
from src.services.coupon_service import coupon_service

router = APIRouter()


@router.post("/", response_model=Coupon)
def create_coupon(
    *, 
    db: Session = Depends(deps.get_db),
    coupon_in: CouponCreate,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Create new coupon for the current seller."""
    return coupon_service.create_with_seller(db, obj_in=coupon_in, seller=current_user)


@router.get("/", response_model=List[Coupon])
def read_coupons(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    sort_by: Optional[str] = None,
    sort_order: str = 'desc',
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Retrieve coupons for the current seller with filtering and sorting."""
    return coupon_service.get_multi_by_seller(
        db, 
        seller=current_user, 
        skip=skip, 
        limit=limit,
        is_active=is_active,
        sort_by=sort_by,
        sort_order=sort_order
    )


@router.get("/{coupon_id}", response_model=Coupon)
def read_coupon(
    *, 
    db: Session = Depends(deps.get_db),
    coupon_id: int,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Get a specific coupon by ID for the current seller."""
    coupon = coupon_service.get(db, id=coupon_id)
    if not coupon or coupon.seller_id != current_user.id:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return coupon


@router.put("/{coupon_id}", response_model=Coupon)
def update_coupon(
    *, 
    db: Session = Depends(deps.get_db),
    coupon_id: int,
    coupon_in: CouponUpdate,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Update a coupon for the current seller."""
    coupon = coupon_service.get(db, id=coupon_id)
    if not coupon or coupon.seller_id != current_user.id:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return coupon_service.update(db, db_obj=coupon, obj_in=coupon_in)


@router.delete("/{coupon_id}", response_model=Coupon)
def delete_coupon(
    *, 
    db: Session = Depends(deps.get_db),
    coupon_id: int,
    current_user: User = Depends(deps.get_current_active_vendeur)
):
    """Delete a coupon for the current seller."""
    coupon = coupon_service.get(db, id=coupon_id)
    if not coupon or coupon.seller_id != current_user.id:
        raise HTTPException(status_code=404, detail="Coupon not found")
        return coupon_service.remove(db, id=coupon_id)


@router.post("/admin/", response_model=Coupon)
def create_coupon_admin(
    *, 
    db: Session = Depends(deps.get_db),
    coupon_in: CouponCreateAdmin,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    """Create new coupon as admin."""
    return coupon_service.create_by_admin(db, obj_in=coupon_in)


@router.get("/admin/", response_model=List[Coupon])
def read_coupons_admin(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    sort_by: Optional[str] = None,
    sort_order: str = 'desc',
    current_user: User = Depends(deps.get_current_active_superuser)
):
    """Retrieve all coupons as an admin with filtering and sorting."""
    return coupon_service.get_multi(
        db, 
        skip=skip, 
        limit=limit,
        is_active=is_active,
        sort_by=sort_by,
        sort_order=sort_order
    )


@router.get("/admin/{coupon_id}", response_model=Coupon)
def read_coupon_admin(
    *, 
    db: Session = Depends(deps.get_db),
    coupon_id: int,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    """Get a specific coupon by ID as an admin."""
    coupon = coupon_service.get(db, id=coupon_id)
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return coupon


@router.put("/admin/{coupon_id}", response_model=Coupon)
def update_coupon_admin(
    *, 
    db: Session = Depends(deps.get_db),
    coupon_id: int,
    coupon_in: CouponUpdate,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    """Update a coupon as an admin."""
    coupon = coupon_service.get(db, id=coupon_id)
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return coupon_service.update(db, db_obj=coupon, obj_in=coupon_in)


@router.delete("/admin/{coupon_id}", response_model=Coupon)
def delete_coupon_admin(
    *, 
    db: Session = Depends(deps.get_db),
    coupon_id: int,
    current_user: User = Depends(deps.get_current_active_superuser)
):
    """Delete a coupon as an admin."""
    coupon = coupon_service.get(db, id=coupon_id)
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return coupon_service.remove(db, id=coupon_id)
