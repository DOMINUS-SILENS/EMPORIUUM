from datetime import datetime, timedelta
from typing import List, Dict

from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from src.models import PurchaseDB, ProductDB, User

class VendeurAnalyticsService:
    def get_sales_by_period(
        self, db: Session, *, seller: User, start_date: datetime, end_date: datetime
    ) -> List[Dict[str, any]]:
        """Get sales data grouped by day for a given period."""
        sales_data = (
            db.query(
                func.date(PurchaseDB.created_at).label("date"),
                func.sum(PurchaseDB.total_price).label("total_sales"),
                func.count(PurchaseDB.id).label("order_count"),
            )
            .join(ProductDB, PurchaseDB.product_id == ProductDB.id)
            .filter(
                and_(
                    ProductDB.seller_id == seller.id,
                    PurchaseDB.created_at >= start_date,
                    PurchaseDB.created_at <= end_date,
                )
            )
            .group_by(func.date(PurchaseDB.created_at))
            .order_by(func.date(PurchaseDB.created_at))
            .all()
        )

        # Convert to list of dicts
        return [
            {"date": r.date, "total_sales": r.total_sales, "order_count": r.order_count}
            for r in sales_data
        ]

vendeur_analytics_service = VendeurAnalyticsService()
