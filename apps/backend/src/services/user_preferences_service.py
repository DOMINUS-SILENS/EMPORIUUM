from sqlalchemy.orm import Session

from src.models.user_preferences import UserPreferencesDB, UserPreferencesUpdate
from src.models.user import User

class UserPreferencesService:
    def get_or_create(self, db: Session, *, user: User) -> UserPreferencesDB:
        """Retrieve a user's preferences, creating them if they don't exist."""
        preferences = db.query(UserPreferencesDB).filter(UserPreferencesDB.user_id == user.id).first()
        if not preferences:
            preferences = UserPreferencesDB(user_id=user.id)
            db.add(preferences)
            db.commit()
            db.refresh(preferences)
        return preferences

    def update(self, db: Session, *, db_obj: UserPreferencesDB, obj_in: UserPreferencesUpdate) -> UserPreferencesDB:
        """Update a user's preferences."""
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

user_preferences_service = UserPreferencesService()
