from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api import deps
from src.db.models import User
from src.schemas.chat import Conversation, Message, MessageCreate, ConversationCreate
from src.services.chat_service import chat_service
from src.services.user_service import user_service

router = APIRouter()


@router.get("/conversations", response_model=List[Conversation])
def get_conversations(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Retrieve all conversations for the current user."""
    return chat_service.get_conversations(db, user_id=current_user.id)


@router.post("/conversations", response_model=Conversation)
def create_conversation(
    *, 
    db: Session = Depends(deps.get_db),
    conv_in: ConversationCreate,
    current_user: User = Depends(deps.get_current_active_user),
):
    """Create a new conversation with another user."""
    participant = user_service.get(db, id=conv_in.participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    existing_conversation = chat_service.get_conversation_between_users(
        db, user1_id=current_user.id, user2_id=conv_in.participant_id
    )
    if existing_conversation:
        return existing_conversation

    return chat_service.create_conversation(
        db, user1_id=current_user.id, user2_id=conv_in.participant_id
    )


@router.get("/conversations/{conversation_id}/messages", response_model=List[Message])
def get_messages(
    conversation_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Retrieve messages from a specific conversation."""
    conversation = chat_service.get_conversations(db, user_id=current_user.id)
    conv_ids = [c.id for c in conversation]
    if conversation_id not in conv_ids:
        raise HTTPException(status_code=403, detail="Not authorized to view this conversation")
    return chat_service.get_messages(db, conversation_id=conversation_id)


@router.post("/messages", response_model=Message)
def send_message(
    *, 
    db: Session = Depends(deps.get_db),
    message_in: MessageCreate,
    current_user: User = Depends(deps.get_current_active_user),
):
    """Send a new message."""
    conversation = chat_service.get_conversations(db, user_id=current_user.id)
    conv_ids = [c.id for c in conversation]
    if message_in.conversation_id not in conv_ids:
        raise HTTPException(status_code=403, detail="Not authorized to send messages to this conversation")
    return chat_service.create_message(db, obj_in=message_in, sender_id=current_user.id)
