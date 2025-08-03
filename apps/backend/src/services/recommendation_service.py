from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from src.db.models import User, PurchaseDB, ProductDB

class RecommendationService:
    def get_recommendations_for_user(self, db: Session, *, user: User, limit: int = 10) -> List[ProductDB]:
        """
        Generate product recommendations for a user based on their purchase history.
        Recommends popular products from categories the user has purchased from.
        """
        # Find categories the user has purchased from
        purchased_categories = (
            db.query(ProductDB.category)
            .join(PurchaseDB, PurchaseDB.product_id == ProductDB.id)
            .filter(PurchaseDB.buyer_id == user.id)
            .distinct()
            .all()
        )
        purchased_categories = [c[0] for c in purchased_categories]

        if not purchased_categories:
            # If user has no purchase history, recommend overall best-sellers
            return (
                db.query(ProductDB)
                .join(PurchaseDB, PurchaseDB.product_id == ProductDB.id)
                .group_by(ProductDB.id)
                .order_by(desc(func.count(PurchaseDB.id)))
                .limit(limit)
                .all()
            )

        # Find products the user has already purchased
        user_purchased_product_ids = (
            db.query(PurchaseDB.product_id)
            .filter(PurchaseDB.buyer_id == user.id)
            .distinct()
            .all()
        )
        user_purchased_product_ids = {p[0] for p in user_purchased_product_ids}

        # Find popular products in those categories, excluding ones already purchased
        recommendations = (
            db.query(ProductDB)
            .join(PurchaseDB, PurchaseDB.product_id == ProductDB.id)
            .filter(ProductDB.category.in_(purchased_categories))
            .filter(ProductDB.id.notin_(user_purchased_product_ids))
            .group_by(ProductDB.id)
            .order_by(desc(func.count(PurchaseDB.id)))
            .limit(limit)
            .all()
        )

        return recommendations

recommendation_service = RecommendationService()
