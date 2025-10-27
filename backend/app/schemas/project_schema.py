from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class ProjectBase(BaseModel):
    name: str = Field(..., max_length=100, title="Project Name")
    description: Optional[str] = Field(None, max_length=500, title="Description")

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class ProjectRead(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# If you want to include task summaries in project details:
class TaskSummary(BaseModel):
    id: int
    title: str
    status: str
    due_date: Optional[datetime]
    assignee_id: Optional[int]

    class Config:
        from_attributes = True

class ProjectDetail(ProjectRead):
    tasks: List[TaskSummary] = []

    class Config:
        from_attributes = True
