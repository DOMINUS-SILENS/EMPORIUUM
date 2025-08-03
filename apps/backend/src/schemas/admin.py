from pydantic import BaseModel
from typing import List
from datetime import datetime

from .user import User
from .order import Order

class DashboardStats(BaseModel):
    total_revenue: float
    total_orders: int
    total_customers: int
    total_vendors: int

class SalesDataPoint(BaseModel):
    date: str
    sales: float

class SalesChartData(BaseModel):
    data: List[SalesDataPoint]

class TopVendor(BaseModel):
    vendor: User
    total_sales: float

class AdminDashboardData(BaseModel):
    stats: DashboardStats
    sales_chart: SalesChartData
    top_vendors: List[TopVendor]
    recent_orders: List[Order]
