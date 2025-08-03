from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from .user import User

# Message Schemas
class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    conversation_id: int

class Message(MessageBase):
    id: int
    sender_id: int
    created_at: datetime
    is_read: bool
    sender: User

    class Config:
        orm_mode = True

# Conversation Schemas
class ConversationBase(BaseModel):
    pass

class ConversationCreate(ConversationBase):
    participant_id: int

class Conversation(ConversationBase):
    id: int
    user1: User
    user2: User
    messages: List[Message] = []
    created_at: datetime

    class Config:
        orm_mode = True
