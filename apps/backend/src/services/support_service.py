from typing import List, Optional
from sqlalchemy.orm import Session

from src.models.support import SupportTicketDB, SupportMessageDB, SupportTicketCreate, SupportTicketUpdate
from src.models.user import User

class SupportService:
    def create_ticket(self, db: Session, *, ticket_in: SupportTicketCreate, user: User) -> SupportTicketDB:
        """Create a new support ticket with an initial message."""
        db_ticket = SupportTicketDB(
            subject=ticket_in.subject,
            user_id=user.id,
            status=ticket_in.status
        )
        db.add(db_ticket)
        db.flush()  # Flush to get the ticket ID for the message

        initial_message = SupportMessageDB(
            ticket_id=db_ticket.id,
            author_id=user.id,
            content=ticket_in.initial_message
        )
        db.add(initial_message)
        db.commit()
        db.refresh(db_ticket)
        return db_ticket

    def get_ticket_by_id(self, db: Session, *, ticket_id: int) -> Optional[SupportTicketDB]:
        """Retrieve a single ticket by its ID."""
        return db.query(SupportTicketDB).filter(SupportTicketDB.id == ticket_id).first()

    def get_tickets_by_user(self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100) -> List[SupportTicketDB]:
        """Retrieve all support tickets for a specific user."""
        return (
            db.query(SupportTicketDB)
            .filter(SupportTicketDB.user_id == user_id)
            .order_by(SupportTicketDB.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def add_message_to_ticket(self, db: Session, *, ticket: SupportTicketDB, content: str, author: User) -> SupportTicketDB:
        """Add a new message to an existing support ticket."""
        new_message = SupportMessageDB(
            ticket_id=ticket.id,
            author_id=author.id,
            content=content
        )
        db.add(new_message)
        db.commit()
        db.refresh(ticket)
        return ticket

    def update_ticket_status(self, db: Session, *, ticket: SupportTicketDB, status_in: SupportTicketUpdate) -> SupportTicketDB:
        """Update the status of a support ticket."""
        ticket.status = status_in.status
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        return ticket

support_service = SupportService()
