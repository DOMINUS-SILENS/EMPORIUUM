from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from src.db.base_class import Base
from .user import User as UserSchema # For nesting in schemas

# --- Enums ---

class TicketStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    CLOSED = "closed"

# --- Pydantic Schemas ---

class SupportMessageBase(BaseModel):
    content: str

class SupportMessageCreate(SupportMessageBase):
    pass

class SupportMessage(SupportMessageBase):
    id: int
    ticket_id: int
    author_id: int
    created_at: DateTime
    author: UserSchema

    class Config:
        orm_mode = True

class SupportTicketBase(BaseModel):
    subject: str
    status: TicketStatus = TicketStatus.OPEN

class SupportTicketCreate(SupportTicketBase):
    initial_message: str

class SupportTicketUpdate(BaseModel):
    status: TicketStatus

class SupportTicket(SupportTicketBase):
    id: int
    user_id: int
    messages: List[SupportMessage] = []
    created_at: DateTime
    updated_at: Optional[DateTime]

    class Config:
        orm_mode = True

# --- SQLAlchemy Models ---

class SupportTicketDB(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.OPEN, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="support_tickets")
    messages = relationship("SupportMessageDB", back_populates="ticket", cascade="all, delete-orphan")

class SupportMessageDB(Base):
    __tablename__ = "support_messages"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("support_tickets.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    ticket = relationship("SupportTicketDB", back_populates="messages")
    author = relationship("User")
