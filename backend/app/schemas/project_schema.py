from pydantic import BaseModel
from typing import Optional, List

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    start_date: Optional[str]
    end_date: Optional[str]

class ProjectResponse(ProjectBase):
    id: int
    start_date: Optional[str]
    end_date: Optional[str]
    class Config:
        orm_mode = True

class ProjectMember(BaseModel):
    id: int
    project_id: int
    user_id: int
    role: str
    class Config:
        from_attributes = True
