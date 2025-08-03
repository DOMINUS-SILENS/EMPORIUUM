from sqlalchemy.orm import Session

from src.models.rewards import LoyaltyAccountDB, LoyaltyTransactionDB
from src.models.user import User

class RewardsService:
    def get_or_create_account(self, db: Session, *, user: User) -> LoyaltyAccountDB:
        """Retrieve a user's loyalty account, creating one if it doesn't exist."""
        account = db.query(LoyaltyAccountDB).filter(LoyaltyAccountDB.user_id == user.id).first()
        if not account:
            account = LoyaltyAccountDB(user_id=user.id, points_balance=0)
            db.add(account)
            db.commit()
            db.refresh(account)
        return account

    def add_points(self, db: Session, *, account: LoyaltyAccountDB, points: int, reason: str) -> LoyaltyAccountDB:
        """Add points to a loyalty account and create a transaction record."""
        if points <= 0:
            raise ValueError("Points to add must be positive.")

        account.points_balance += points
        transaction = LoyaltyTransactionDB(
            account_id=account.id,
            points_change=points,
            reason=reason
        )
        db.add(transaction)
        db.commit()
        db.refresh(account)
        return account

    def redeem_points(self, db: Session, *, account: LoyaltyAccountDB, points: int, reason: str) -> LoyaltyAccountDB:
        """Redeem points from a loyalty account and create a transaction record."""
        if points <= 0:
            raise ValueError("Points to redeem must be positive.")
        if account.points_balance < points:
            raise ValueError("Insufficient points balance.")

        account.points_balance -= points
        transaction = LoyaltyTransactionDB(
            account_id=account.id,
            points_change=-points,
            reason=reason
        )
        db.add(transaction)
        db.commit()
        db.refresh(account)
        return account

rewards_service = RewardsService()
