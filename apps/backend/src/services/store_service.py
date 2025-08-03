from typing import Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.models import User
from src.models.store import StoreCreate, StoreDB, StoreUpdate
from src.services.base_service import BaseService


class StoreService(BaseService[StoreDB, StoreCreate, StoreUpdate]):

    def get_by_seller(self, db: Session, *, seller: User) -> Optional[StoreDB]:
        return db.query(self.model).filter(self.model.seller_id == seller.id).first()

    def get_by_slug(self, db: Session, *, slug: str) -> Optional[StoreDB]:
        return db.query(self.model).filter(self.model.slug == slug).first()

    def create_with_seller(self, db: Session, *, obj_in: StoreCreate, seller: User) -> StoreDB:
        # Check if seller already has a store
        if self.get_by_seller(db, seller=seller):
            raise HTTPException(status_code=400, detail="A store already exists for this seller.")

        # Check if slug is unique
        if self.get_by_slug(db, slug=obj_in.slug):
            raise HTTPException(status_code=400, detail="This store URL slug is already taken.")

        db_obj = self.model(**obj_in.dict(), seller_id=seller.id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_by_seller(self, db: Session, *, db_obj: StoreDB, obj_in: StoreUpdate, seller: User) -> StoreDB:
        if db_obj.seller_id != seller.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this store.")

        # If slug is being updated, check for uniqueness
        if obj_in.slug and obj_in.slug != db_obj.slug and self.get_by_slug(db, slug=obj_in.slug):
            raise HTTPException(status_code=400, detail="This store URL slug is already taken.")

        return super().update(db, db_obj=db_obj, obj_in=obj_in)


store_service = StoreService(StoreDB)
