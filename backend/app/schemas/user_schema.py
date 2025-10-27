from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    manager = "manager"
    developer = "developer"
class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: UserRole
  
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=72)
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True        