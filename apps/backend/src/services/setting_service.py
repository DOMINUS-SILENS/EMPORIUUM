from typing import Optional
from sqlalchemy.orm import Session

from src.models.setting import SettingDB, SettingCreate, SettingUpdate
from src.services.base_service import BaseService


class SettingService(BaseService[SettingDB, SettingCreate, SettingUpdate]):
    def get_by_key(self, db: Session, *, key: str) -> Optional[SettingDB]:
        return db.query(self.model).filter(self.model.key == key).first()


setting_service = SettingService(SettingDB)
