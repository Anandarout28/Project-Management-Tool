from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import declarative_base, relationship
import enum

import sqlalchemy.sql.functions as func
Base = declarative_base()
from datetime import datetime, timezone
class UserRole(enum.Enum):
    admin = 'admin'
    manager = 'manager'
    developer = 'developer'
    user = 'user'
class TaskStatus(enum.Enum):
    TODO = 'To Do'
    IN_PROGRESS = 'In Progress'
    DONE = 'Done'
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(64), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    email = Column(String(128), unique=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    
    # Only one "projects" relationship pointing to Project.owner
    projects = relationship("Project", back_populates="owner")
    # If you have project_members, use a DIFFERENT name
    project_members = relationship("ProjectMember", back_populates="user")
    tasks = relationship("Task", back_populates="assignee")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Points to User.projects
    owner = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    # If you have project_members
    members = relationship("ProjectMember", back_populates="project")

class ProjectMember(Base):
    __tablename__ = "project_members"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Points to User.project_members (NOT User.projects!)
    user = relationship("User", back_populates="project_members")
    # Points to Project.members
    project = relationship("Project", back_populates="members")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(String(24), default="pending")
    project_id = Column(Integer, ForeignKey("projects.id"))
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks")
    comments = relationship("TaskComment", back_populates="task")  # ← ADD THIS LINE


class TaskComment(Base):
    __tablename__ = 'task_comments'
    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    task = relationship("Task", back_populates="comments")  # ← MUST point to Task.comments
    user = relationship("User") 

