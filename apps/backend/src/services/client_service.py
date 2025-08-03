from typing import List
from sqlalchemy.orm import Session, joinedload

from src.models import PurchaseDB, ProductDB, User

class ClientService:
    def get_clients_by_seller(
        self, db: Session, *, seller: User, skip: int = 0, limit: int = 100
    ) -> List[User]:
        """Retrieve all clients for a specific seller."""
        # First, get the unique IDs of buyers who have purchased from the seller
        buyer_ids = (
            db.query(PurchaseDB.buyer_id)
            .join(ProductDB, PurchaseDB.product_id == ProductDB.id)
            .filter(ProductDB.seller_id == seller.id)
            .distinct()
        ).all()

        # Extract the IDs from the result
        client_ids = [id for (id,) in buyer_ids]

        if not client_ids:
            return []

        # Then, fetch the User objects for these IDs
        clients = (
            db.query(User)
            .filter(User.id.in_(client_ids))
            .offset(skip)
            .limit(limit)
            .all()
        )
        return clients

client_service = ClientService()
