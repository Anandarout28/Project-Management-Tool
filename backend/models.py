from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import declarative_base, relationship
import enum
import datetime

Base = declarative_base()

class UserRole(enum.Enum):
    ADMIN = 'Admin'
    MANAGER = 'Manager'
    DEVELOPER = 'Developer'

class TaskStatus(enum.Enum):
    TODO = 'To Do'
    IN_PROGRESS = 'In Progress'
    DONE = 'Done'

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(64), unique=True, nullable=False)
    password = Column(String(128), nullable=False)   # store hashed password in practice
    email = Column(String(128), unique=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False)

    # Relationships
    projects = relationship('ProjectMember', back_populates='user')
    tasks = relationship('Task', back_populates='assignee')

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False)
    description = Column(Text)
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime)

    # Relationships
    members = relationship('ProjectMember', back_populates='project')
    tasks = relationship('Task', back_populates='project')

class ProjectMember(Base):
    __tablename__ = 'project_members'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    role = Column(Enum(UserRole))

    user = relationship('User', back_populates='projects')
    project = relationship('Project', back_populates='members')

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    title = Column(String(128), nullable=False)
    description = Column(Text)
    status = Column(Enum(TaskStatus), default=TaskStatus.TODO, nullable=False)
    due_date = Column(DateTime)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    assignee_id = Column(Integer, ForeignKey('users.id'))

    project = relationship('Project', back_populates='tasks')
    assignee = relationship('User', back_populates='tasks')
    comments = relationship('TaskComment', back_populates='task')

class TaskComment(Base):
    __tablename__ = 'task_comments'
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey('tasks.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    comment = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    task = relationship('Task', back_populates='comments')
    user = relationship('User')

