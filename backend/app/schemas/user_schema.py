from pydantic import BaseModel, EmailStr
from typing import Optional
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    manager = "manager"
    developer = "developer"
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: UserRole
class UserCreate(UserBase):
    password: str
class userResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True 