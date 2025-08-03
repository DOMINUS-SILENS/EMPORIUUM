from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api import deps
from src.db.models import User
from src.schemas.admin import AdminDashboardData
from src.services.admin_analytics_service import admin_analytics_service

router = APIRouter()


@router.get("/dashboard", response_model=AdminDashboardData)
def get_dashboard_data(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
):
    """Retrieve all data for the admin dashboard."""
    return admin_analytics_service.get_dashboard_data(db)
