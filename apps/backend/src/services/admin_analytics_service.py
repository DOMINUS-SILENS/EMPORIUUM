from sqlalchemy.orm import Session
from sqlalchemy import func, case, desc
from datetime import datetime, timedelta

from src.db.models import Order, OrderItem, User, Product, UserRole
from src.schemas.admin import DashboardStats, SalesDataPoint, TopVendor, AdminDashboardData
from src.services.user_service import user_service
from src.services.order_service import order_service

class AdminAnalyticsService:
    def get_dashboard_data(self, db: Session) -> AdminDashboardData:
        stats = self._get_dashboard_stats(db)
        sales_chart_data = self._get_sales_chart_data(db)
        top_vendors = self._get_top_vendors(db)
        recent_orders = self._get_recent_orders(db)

        return AdminDashboardData(
            stats=stats,
            sales_chart=sales_chart_data,
            top_vendors=top_vendors,
            recent_orders=recent_orders
        )

    def _get_dashboard_stats(self, db: Session) -> DashboardStats:
        total_revenue = db.query(func.sum(Order.total_price)).filter(Order.status == 'completed').scalar() or 0
        total_orders = db.query(func.count(Order.id)).filter(Order.status == 'completed').scalar() or 0
        total_customers = user_service.count_by_role(db, role_name="acheteur")
        total_vendors = user_service.count_by_role(db, role_name="vendeur")

        return DashboardStats(
            total_revenue=total_revenue,
            total_orders=total_orders,
            total_customers=total_customers,
            total_vendors=total_vendors,
        )

    def _get_sales_chart_data(self, db: Session, days: int = 30) -> SalesChartData:
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)

        sales_data = (
            db.query(
                func.date(Order.created_at).label("date"),
                func.sum(Order.total_price).label("sales"),
            )
            .filter(Order.created_at >= start_date)
            .filter(Order.status == 'completed')
            .group_by(func.date(Order.created_at))
            .order_by(func.date(Order.created_at))
            .all()
        )
        
        data_points = [SalesDataPoint(date=row.date.isoformat(), sales=row.sales) for row in sales_data]
        return SalesChartData(data=data_points)

    def _get_top_vendors(self, db: Session, limit: int = 5) -> list[TopVendor]:
        top_vendors_data = (
            db.query(
                User,
                func.sum(OrderItem.price * OrderItem.quantity).label("total_sales")
            )
            .join(Product, User.id == Product.seller_id)
            .join(OrderItem, Product.id == OrderItem.product_id)
            .join(Order, OrderItem.order_id == Order.id)
            .filter(Order.status == 'completed')
            .filter(User.role == UserRole.VENDEUR)
            .group_by(User.id)
            .order_by(desc("total_sales"))
            .limit(limit)
            .all()
        )

        return [TopVendor(vendor=vendor, total_sales=sales) for vendor, sales in top_vendors_data]

    def _get_recent_orders(self, db: Session, limit: int = 10) -> list[Order]:
        return order_service.get_multi(db, skip=0, limit=limit, sort_by="created_at", sort_order="desc")

admin_analytics_service = AdminAnalyticsService()
