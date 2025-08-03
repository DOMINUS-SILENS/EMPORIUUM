from typing import List, Optional
from sqlalchemy import desc, asc
from sqlalchemy.orm import Session

from src.models import PurchaseDB, User, CartDB, ProductDB
from src.models.purchase import PurchaseStatus, PurchaseUpdate
from src.services.base_service import BaseService


class OrderService(BaseService[PurchaseDB, None, PurchaseUpdate]):
    def get_multi_by_buyer(
        self, db: Session, *, buyer_id: int, skip: int = 0, limit: int = 100
    ) -> List[PurchaseDB]:
        """Retrieve all orders for a specific buyer."""
        return (
            db.query(self.model)
            .filter(self.model.buyer_id == buyer_id)
            .order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_purchases_from_cart_after_payment(
        self, db: Session, *, user: User, cart: CartDB, payment_intent_id: str
    ) -> List[PurchaseDB]:
        """Create purchase records from cart items after successful payment."""
        if not cart.items:
            raise ValueError("Cannot create purchases from an empty cart.")

        created_purchases = []
        for item in cart.items:
            product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
            if not product:
                raise ValueError(f"Product with ID {item.product_id} not found.")

            purchase_data = {
                "product_id": item.product_id,
                "quantity": item.quantity,
                "unit_price": product.price,
                "buyer_id": user.id,
                "stripe_payment_intent_id": payment_intent_id,
                # Add default shipping info, assuming it's stored elsewhere
                "shipping_address": "Default Address",
                "shipping_city": "Default City",
                "shipping_postal_code": "00000",
                "shipping_country": "Default Country",
            }
            db_purchase = PurchaseDB(**purchase_data)
            db.add(db_purchase)
            created_purchases.append(db_purchase)
        
        db.commit()
        for p in created_purchases:
            db.refresh(p)
        
        return created_purchases

    def get_multi_by_seller(
        self, 
        db: Session, 
        *, 
        seller: User, 
        skip: int = 0, 
        limit: int = 100,
        status: Optional[PurchaseStatus] = None,
        sort_by: Optional[str] = None,
        sort_order: str = 'desc'
    ) -> List[PurchaseDB]:
        """Retrieve all orders for a specific seller with filtering and sorting."""
        query = (
            db.query(self.model)
            .join(self.model.product)
            .filter(ProductDB.seller_id == seller.id)
        )

        if status:
            query = query.filter(self.model.status == status)

        if sort_by in ['created_at', 'status']:
            sort_column = getattr(self.model, sort_by)
            if sort_order.lower() == 'desc':
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))
        else:
            # Default sort by creation date
            query = query.order_by(desc(self.model.created_at))

        return query.offset(skip).limit(limit).all()

    def get_order_for_seller(
        self, db: Session, *, seller: User, order_id: int
    ) -> Optional[PurchaseDB]:
        """Retrieve a single order for a specific seller."""
        return (
            db.query(self.model)
            .join(self.model.product)
            .filter(ProductDB.seller_id == seller.id, self.model.id == order_id)
            .first()
        )

    def get_all_orders(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        status: Optional[PurchaseStatus] = None,
        user_id: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_order: str = 'desc'
    ) -> List[PurchaseDB]:
        """Retrieve all orders with filtering and sorting for an admin."""
        query = db.query(self.model)

        if status:
            query = query.filter(self.model.status == status)

        if user_id:
            query = query.filter(self.model.buyer_id == user_id)

        if sort_by in ['created_at', 'status']:
            sort_column = getattr(self.model, sort_by)
            if sort_order.lower() == 'desc':
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(self.model.created_at))

        return query.offset(skip).limit(limit).all()

    def update_order_status(
        self, db: Session, *, order: PurchaseDB, new_status: PurchaseStatus
    ) -> PurchaseDB:
        """Update the status of an order."""
        update_data = {"status": new_status}
        return self.update(db, db_obj=order, obj_in=update_data)




order_service = OrderService(PurchaseDB)
