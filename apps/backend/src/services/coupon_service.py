from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from src.models import CouponCreate, CouponCreateAdmin, CouponDB, CouponUpdate, User
from src.services.base_service import BaseService


class CouponService(BaseService[CouponDB, CouponCreate, CouponUpdate]):
    def create_with_seller(
        self, db: Session, *, obj_in: CouponCreate, seller: User
    ) -> CouponDB:
        db_obj = self.model(**obj_in.dict(), seller_id=seller.id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def create_by_admin(
        self, db: Session, *, obj_in: CouponCreateAdmin
    ) -> CouponDB:
        db_obj = self.model(**obj_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        is_active: Optional[bool] = None,
        sort_by: Optional[str] = None,
        sort_order: str = 'desc'
    ) -> List[CouponDB]:
        query = db.query(self.model)

        if is_active is not None:
            query = query.filter(self.model.is_active == is_active)

        if sort_by in ['created_at', 'expires_at']:
            sort_column = getattr(self.model, sort_by)
            if sort_order.lower() == 'desc':
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(self.model.created_at))

        return query.offset(skip).limit(limit).all()

    def get_multi_by_seller(
        self, 
        db: Session, 
        *, 
        seller: User, 
        skip: int = 0, 
        limit: int = 100,
        is_active: Optional[bool] = None,
        sort_by: Optional[str] = None,
        sort_order: str = 'desc'
    ) -> List[CouponDB]:
        query = db.query(self.model).filter(self.model.seller_id == seller.id)

        if is_active is not None:
            query = query.filter(self.model.is_active == is_active)

        if sort_by in ['created_at', 'expires_at']:
            sort_column = getattr(self.model, sort_by)
            if sort_order.lower() == 'desc':
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(self.model.created_at))

        return query.offset(skip).limit(limit).all()


coupon_service = CouponService(CouponDB)
