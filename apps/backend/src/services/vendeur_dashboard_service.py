from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_

from src.db.models import PurchaseDB, ProductDB, User

class VendeurDashboardService:

    def get_seller_stats(self, db: Session, *, seller: User):
        """Get all dashboard stats for a specific seller."""
        today = datetime.utcnow()
        start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # Base query for seller's products
        seller_products_query = db.query(ProductDB.id).filter(ProductDB.seller_id == seller.id)
        seller_product_ids = [p.id for p in seller_products_query.all()]

        if not seller_product_ids:
            return {
                "monthly_sales": 0,
                "total_orders": 0,
                "active_clients": 0,
                "total_products": 0,
                "recent_orders": [],
                "top_products": []
            }

        # Monthly Sales
        monthly_sales = db.query(func.sum(PurchaseDB.total_price)) \
            .filter(PurchaseDB.product_id.in_(seller_product_ids)) \
            .filter(PurchaseDB.purchase_date >= start_of_month) \
            .scalar() or 0

        # Total Orders
        total_orders = db.query(func.count(PurchaseDB.id)) \
            .filter(PurchaseDB.product_id.in_(seller_product_ids)) \
            .scalar() or 0

        # Active Clients (unique buyers)
        active_clients = db.query(func.count(func.distinct(PurchaseDB.buyer_id))) \
            .filter(PurchaseDB.product_id.in_(seller_product_ids)) \
            .scalar() or 0

        # Total Products
        total_products = len(seller_product_ids)

        # Recent Orders
        recent_orders = db.query(PurchaseDB) \
            .filter(PurchaseDB.product_id.in_(seller_product_ids)) \
            .order_by(desc(PurchaseDB.purchase_date)) \
            .limit(5).all()

        # Top Selling Products
        top_products = db.query(ProductDB, func.sum(PurchaseDB.quantity).label('total_sold')) \
            .join(PurchaseDB, PurchaseDB.product_id == ProductDB.id) \
            .filter(PurchaseDB.product_id.in_(seller_product_ids)) \
            .group_by(ProductDB.id) \
            .order_by(desc('total_sold')) \
            .limit(5).all()

        return {
            "monthly_sales": monthly_sales,
            "total_orders": total_orders,
            "active_clients": active_clients,
            "total_products": total_products,
            "recent_orders": recent_orders,
            "top_products": [p[0] for p in top_products] # Return only the ProductDB objects
        }

vendeur_dashboard_service = VendeurDashboardService()
