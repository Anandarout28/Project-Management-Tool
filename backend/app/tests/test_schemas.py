import pytest
from pydantic import ValidationError
from app.schemas.user_schema import UserCreate, UserRead, UserRole
from app.schemas.project_schema import ProjectCreate, ProjectResponse
from app.schemas.task_schema import TaskCreate, TaskResponse, StatusType
from app.schemas.comment_schema import CommentCreate, CommentResponse

class TestUserSchema:
    """Test cases for User schemas."""
    
    def test_user_create_valid(self):
        """Test creating a valid user."""
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "password": "password123"
        }
        user = UserCreate(**user_data)
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.role == UserRole.USER
        assert user.password == "password123"
    
    def test_user_create_invalid_email(self):
        """Test creating user with invalid email."""
        user_data = {
            "username": "testuser",
            "email": "invalid-email",
            "role": "user",
            "password": "password123"
        }
        with pytest.raises(ValidationError):
            UserCreate(**user_data)
    
    def test_user_create_invalid_role(self):
        """Test creating user with invalid role."""
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "role": "invalid_role",
            "password": "password123"
        }
        with pytest.raises(ValidationError):
            UserCreate(**user_data)
    
    def test_user_read_valid(self):
        """Test creating a valid user read response."""
        user_data = {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "role": "admin"
        }
        user = UserRead(**user_data)
        assert user.id == 1
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.role == UserRole.ADMIN

class TestProjectSchema:
    """Test cases for Project schemas."""
    
    def test_project_create_valid(self):
        """Test creating a valid project."""
        project_data = {
            "name": "Test Project",
            "description": "A test project",
            "start_date": "2024-01-01",
            "end_date": "2024-12-31"
        }
        project = ProjectCreate(**project_data)
        assert project.name == "Test Project"
        assert project.description == "A test project"
        assert project.start_date == "2024-01-01"
        assert project.end_date == "2024-12-31"
    
    def test_project_create_minimal(self):
        """Test creating project with minimal data."""
        project_data = {
            "name": "Minimal Project"
        }
        project = ProjectCreate(**project_data)
        assert project.name == "Minimal Project"
        assert project.description is None
        assert project.start_date is None
        assert project.end_date is None
    
    def test_project_create_missing_name(self):
        """Test creating project without required name."""
        project_data = {
            "description": "No name project"
        }
        with pytest.raises(ValidationError):
            ProjectCreate(**project_data)
    
    def test_project_response_valid(self):
        """Test creating a valid project response."""
        project_data = {
            "id": 1,
            "name": "Test Project",
            "description": "A test project",
            "start_date": "2024-01-01",
            "end_date": "2024-12-31"
        }
        project = ProjectResponse(**project_data)
        assert project.id == 1
        assert project.name == "Test Project"
        assert project.description == "A test project"

class TestTaskSchema:
    """Test cases for Task schemas."""
    
    def test_task_create_valid(self):
        """Test creating a valid task."""
        task_data = {
            "title": "Test Task",
            "description": "A test task",
            "status": "todo",
            "due_date": "2024-12-31",
            "project_id": 1,
            "assignee_id": 1
        }
        task = TaskCreate(**task_data)
        assert task.title == "Test Task"
        assert task.description == "A test task"
        assert task.status == StatusType.todo
        assert task.due_date == "2024-12-31"
        assert task.project_id == 1
        assert task.assignee_id == 1
    
    def test_task_create_minimal(self):
        """Test creating task with minimal data."""
        task_data = {
            "title": "Minimal Task",
            "project_id": 1
        }
        task = TaskCreate(**task_data)
        assert task.title == "Minimal Task"
        assert task.description is None
        assert task.status == StatusType.todo
        assert task.due_date is None
        assert task.project_id == 1
        assert task.assignee_id is None
    
    def test_task_create_invalid_status(self):
        """Test creating task with invalid status."""
        task_data = {
            "title": "Test Task",
            "project_id": 1,
            "status": "invalid_status"
        }
        with pytest.raises(ValidationError):
            TaskCreate(**task_data)
    
    def test_task_response_valid(self):
        """Test creating a valid task response."""
        task_data = {
            "id": 1,
            "title": "Test Task",
            "description": "A test task",
            "status": "in_progress",
            "due_date": "2024-12-31",
            "project_id": 1,
            "assignee_id": 1
        }
        task = TaskResponse(**task_data)
        assert task.id == 1
        assert task.title == "Test Task"
        assert task.status == StatusType.in_progress
        assert task.project_id == 1

class TestCommentSchema:
    """Test cases for Comment schemas."""
    
    def test_comment_create_valid(self):
        """Test creating a valid comment."""
        comment_data = {
            "comment": "This is a test comment",
            "task_id": 1,
            "user_id": 1
        }
        comment = CommentCreate(**comment_data)
        assert comment.comment == "This is a test comment"
        assert comment.task_id == 1
        assert comment.user_id == 1
    
    def test_comment_create_missing_fields(self):
        """Test creating comment with missing required fields."""
        comment_data = {
            "comment": "Test comment"
        }
        with pytest.raises(ValidationError):
            CommentCreate(**comment_data)
    
    def test_comment_response_valid(self):
        """Test creating a valid comment response."""
        comment_data = {
            "id": 1,
            "comment": "This is a test comment",
            "task_id": 1,
            "user_id": 1,
            "timestamp": "2024-01-01T12:00:00"
        }
        comment = CommentResponse(**comment_data)
        assert comment.id == 1
        assert comment.comment == "This is a test comment"
        assert comment.task_id == 1
        assert comment.user_id == 1
        assert comment.timestamp == "2024-01-01T12:00:00"
