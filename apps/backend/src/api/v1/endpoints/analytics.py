from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api import deps
from src.models import User
from src.services.analytics_service import analytics_service
from src.services.admin_analytics_service import admin_analytics_service
from src.schemas.admin import AdminDashboardData

router = APIRouter()


@router.get("/summary", response_model=dict)
def get_seller_summary(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_vendeur),
):
    """Get a summary of the current seller's performance."""
    return analytics_service.get_seller_summary(db, seller=current_user)


@router.get("/admin/dashboard", response_model=AdminDashboardData)
def get_admin_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
):
    """Get all data for the admin dashboard."""
    return admin_analytics_service.get_dashboard_data(db)
