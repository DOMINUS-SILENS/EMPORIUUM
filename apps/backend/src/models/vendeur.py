from typing import List, Optional
from pydantic import BaseModel
from datetime import date

from src.models.product import Product
from src.models.purchase import Purchase

class VendeurDashboardStats(BaseModel):
    monthly_sales: float
    total_orders: int
    active_clients: int
    total_products: int
    recent_orders: List[Purchase]
    top_products: List[Product]


class SalesByDay(BaseModel):
    date: date
    total_sales: float
    order_count: int

    class Config:
        orm_mode = True
