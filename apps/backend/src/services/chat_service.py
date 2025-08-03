from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from src.db.models import User
from src.db.models.chat import Conversation, Message
from src.schemas.chat import MessageCreate

class ChatService:
    def get_conversations(self, db: Session, *, user_id: int) -> List[Conversation]:
        """Retrieve all conversations for a user."""
        return db.query(Conversation).filter(
            or_(Conversation.user1_id == user_id, Conversation.user2_id == user_id)
        ).all()

    def get_conversation_between_users(self, db: Session, *, user1_id: int, user2_id: int) -> Optional[Conversation]:
        """Get a conversation between two specific users."""
        return db.query(Conversation).filter(
            or_(
                (Conversation.user1_id == user1_id and Conversation.user2_id == user2_id),
                (Conversation.user1_id == user2_id and Conversation.user2_id == user1_id)
            )
        ).first()

    def create_conversation(self, db: Session, *, user1_id: int, user2_id: int) -> Conversation:
        """Create a new conversation between two users."""
        db_conversation = Conversation(user1_id=user1_id, user2_id=user2_id)
        db.add(db_conversation)
        db.commit()
        db.refresh(db_conversation)
        return db_conversation

    def get_messages(self, db: Session, *, conversation_id: int) -> List[Message]:
        """Retrieve all messages from a conversation."""
        return db.query(Message).filter(Message.conversation_id == conversation_id).all()

    def create_message(self, db: Session, *, obj_in: MessageCreate, sender_id: int) -> Message:
        """Create a new message in a conversation."""
        db_message = Message(
            conversation_id=obj_in.conversation_id,
            sender_id=sender_id,
            content=obj_in.content
        )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return db_message

chat_service = ChatService()
