from pydantic import BaseModel
from typing import Optional
import enum

class StatusType(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: StatusType = StatusType.todo
    due_date: Optional[str] = None

class TaskCreate(TaskBase):
    project_id: int
    assignee_id: Optional[int]

class TaskResponse(TaskBase):
    id: int
    project_id: int
    assignee_id: Optional[int]
    class Config:
        from_attributes = True
