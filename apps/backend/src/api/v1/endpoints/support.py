from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.api import deps
from src.models import User
from src.models.support import SupportTicket, SupportTicketCreate, SupportTicketUpdate, SupportMessageCreate
from src.services.support_service import support_service

router = APIRouter()


@router.post("/tickets/", response_model=SupportTicket, status_code=status.HTTP_201_CREATED)
def create_support_ticket(
    *, 
    db: Session = Depends(deps.get_db),
    ticket_in: SupportTicketCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Create a new support ticket."""
    return support_service.create_ticket(db, ticket_in=ticket_in, user=current_user)


@router.get("/tickets/", response_model=List[SupportTicket])
def get_user_support_tickets(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100
):
    """Retrieve all support tickets for the current user."""
    return support_service.get_tickets_by_user(db, user_id=current_user.id, skip=skip, limit=limit)


@router.get("/tickets/{ticket_id}", response_model=SupportTicket)
def get_support_ticket(
    ticket_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """Retrieve a specific support ticket."""
    ticket = support_service.get_ticket_by_id(db, ticket_id=ticket_id)
    if not ticket or ticket.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.post("/tickets/{ticket_id}/messages", response_model=SupportTicket)
def add_support_message(
    ticket_id: int,
    *, 
    db: Session = Depends(deps.get_db),
    message_in: SupportMessageCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Add a message to a support ticket."""
    ticket = support_service.get_ticket_by_id(db, ticket_id=ticket_id)
    if not ticket or ticket.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return support_service.add_message_to_ticket(
        db, ticket=ticket, content=message_in.content, author=current_user
    )
