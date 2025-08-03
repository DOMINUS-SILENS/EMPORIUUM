from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api import deps
from src.models import User
from src.models.vendeur import VendeurDashboardStats, SalesByDay
from src.services.vendeur_dashboard_service import vendeur_dashboard_service
from src.services.vendeur_analytics_service import vendeur_analytics_service

router = APIRouter()


@router.get("/dashboard", response_model=VendeurDashboardStats)
def get_vendeur_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_vendeur),
):
    """Retrieve dashboard statistics for the current seller."""
    stats = vendeur_dashboard_service.get_dashboard_stats(db, seller=current_user)
    return stats


@router.get("/analytics/sales", response_model=List[SalesByDay])
def get_sales_analytics(
    db: Session = Depends(deps.get_db),
    start_date: datetime,
    end_date: datetime,
    current_user: User = Depends(deps.get_current_active_vendeur),
):
    """Retrieve sales analytics for the current seller over a specified period."""
    sales_data = vendeur_analytics_service.get_sales_by_period(
        db, seller=current_user, start_date=start_date, end_date=end_date
    )
    return sales_data
