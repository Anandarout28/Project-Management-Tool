from pydantic import BaseModel
from typing import Optional
import enum
from datetime import date
class StatusType(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: StatusType = StatusType.todo
    due_date: Optional[str] = None

class TaskCreate(BaseModel):
    title: str
    description: str
    status: str
    project_id: int
    assignee_id: Optional[int] = None
    due_date: Optional[date] = None
class TaskRead(TaskBase):
    id: int
    project_id: int
    assignee_id: Optional[int]
    created_at: str

    class Config:
        from_attributes = True    

class TaskResponse(TaskBase):
    id: int
    project_id: int
    assignee_id: Optional[int]
    class Config:
        from_attributes = True
