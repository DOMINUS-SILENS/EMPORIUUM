from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta

from src.models import PurchaseDB, ProductDB, User

class AnalyticsService:
    def get_seller_summary(self, db: Session, *, seller: User):
        """Get a summary of a seller's performance."""
        total_revenue = (
            db.query(func.sum(PurchaseDB.unit_price * PurchaseDB.quantity))
            .join(ProductDB, PurchaseDB.product_id == ProductDB.id)
            .filter(ProductDB.seller_id == seller.id)
            .scalar()
        ) or 0

        total_sales = (
            db.query(func.count(PurchaseDB.id))
            .join(ProductDB, PurchaseDB.product_id == ProductDB.id)
            .filter(ProductDB.seller_id == seller.id)
            .scalar()
        ) or 0

        top_products = (
            db.query(
                ProductDB.name,
                func.sum(PurchaseDB.quantity).label("total_quantity_sold"),
            )
            .join(PurchaseDB, ProductDB.id == PurchaseDB.product_id)
            .filter(ProductDB.seller_id == seller.id)
            .group_by(ProductDB.name)
            .order_by(desc("total_quantity_sold"))
            .limit(5)
            .all()
        )

        return {
            "total_revenue": total_revenue,
            "total_sales": total_sales,
            "top_selling_products": [
                {"name": name, "quantity_sold": qty} for name, qty in top_products
            ],
        }

analytics_service = AnalyticsService()
