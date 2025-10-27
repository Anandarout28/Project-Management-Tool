from pydantic import BaseModel
from typing import Optional

class CommentBase(BaseModel):
    comment: str

class CommentCreate(CommentBase):
    task_id: int
    user_id: int

class CommentResponse(CommentBase):
    id: int
    task_id: int
    user_id: int
    timestamp: Optional[str]

    class Config:
       from_attributes = True
