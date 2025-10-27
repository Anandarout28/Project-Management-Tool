import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, SessionLocal
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.models.project_member import ProjectMember

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database dependency override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[SessionLocal] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

class TestUserRouter:
    """Test cases for User router endpoints."""
    
    def test_create_user_success(self, client):
        """Test creating a user successfully."""
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "password": "password123"
        }
        response = client.post("/app/users/", json=user_data)
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "testuser"
        assert data["email"] == "test@example.com"
        assert data["role"] == "user"
        assert "id" in data
    
    def test_create_user_duplicate_email(self, client):
        """Test creating user with duplicate email."""
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "password": "password123"
        }
        # Create first user
        client.post("/app/users/", json=user_data)
        
        # Try to create second user with same email
        user_data["username"] = "testuser2"
        response = client.post("/app/users/", json=user_data)
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]
    
    def test_get_all_users(self, client):
        """Test getting all users."""
        # Create test users
        user1_data = {
            "username": "user1",
            "email": "user1@example.com",
            "role": "user",
            "password": "password123"
        }
        user2_data = {
            "username": "user2",
            "email": "user2@example.com",
            "role": "admin",
            "password": "password123"
        }
        
        client.post("/app/users/", json=user1_data)
        client.post("/app/users/", json=user2_data)
        
        response = client.get("/app/users/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["username"] in ["user1", "user2"]
        assert data[1]["username"] in ["user1", "user2"]

class TestProjectRouter:
    """Test cases for Project router endpoints."""
    
    def test_create_project_success(self, client):
        """Test creating a project successfully."""
        project_data = {
            "name": "Test Project",
            "description": "A test project",
            "start_date": "2024-01-01",
            "end_date": "2024-12-31"
        }
        response = client.post("/app/projects/", json=project_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test Project"
        assert data["description"] == "A test project"
        assert "id" in data
    
    def test_create_project_minimal(self, client):
        """Test creating project with minimal data."""
        project_data = {
            "name": "Minimal Project"
        }
        response = client.post("/app/projects/", json=project_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Minimal Project"
        assert data["description"] is None

class TestTaskRouter:
    """Test cases for Task router endpoints."""
    
    def test_create_task_success(self, client):
        """Test creating a task successfully."""
        # First create a project
        project_data = {
            "name": "Test Project",
            "description": "A test project"
        }
        project_response = client.post("/app/projects/", json=project_data)
        project_id = project_response.json()["id"]
        
        # Create a user
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "password": "password123"
        }
        user_response = client.post("/app/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        # Create task
        task_data = {
            "title": "Test Task",
            "description": "A test task",
            "status": "todo",
            "due_date": "2024-12-31",
            "project_id": project_id,
            "assignee_id": user_id
        }
        response = client.post("/app/tasks/", json=task_data)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test Task"
        assert data["project_id"] == project_id
        assert data["assignee_id"] == user_id
        assert "id" in data
    
    def test_get_task_success(self, client):
        """Test getting a task by ID."""
        # Create project and user first
        project_data = {"name": "Test Project"}
        project_response = client.post("/app/projects/", json=project_data)
        project_id = project_response.json()["id"]
        
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "password": "password123"
        }
        user_response = client.post("/app/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        # Create task
        task_data = {
            "title": "Test Task",
            "project_id": project_id,
            "assignee_id": user_id
        }
        task_response = client.post("/app/tasks/", json=task_data)
        task_id = task_response.json()["id"]
        
        # Get task
        response = client.get(f"/app/tasks/{task_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == task_id
        assert data["title"] == "Test Task"
    
    def test_get_task_not_found(self, client):
        """Test getting a non-existent task."""
        response = client.get("/app/tasks/999")
        assert response.status_code == 404
        assert "Task not found" in response.json()["detail"]
    
    def test_update_task_success(self, client):
        """Test updating a task."""
        # Create project and user first
        project_data = {"name": "Test Project"}
        project_response = client.post("/app/projects/", json=project_data)
        project_id = project_response.json()["id"]
        
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "password": "password123"
        }
        user_response = client.post("/app/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        # Create task
        task_data = {
            "title": "Original Task",
            "project_id": project_id,
            "assignee_id": user_id
        }
        task_response = client.post("/app/tasks/", json=task_data)
        task_id = task_response.json()["id"]
        
        # Update task
        update_data = {
            "title": "Updated Task",
            "description": "Updated description",
            "status": "in_progress",
            "project_id": project_id,
            "assignee_id": user_id
        }
        response = client.put(f"/app/tasks/{task_id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Task"
        assert data["description"] == "Updated description"
        assert data["status"] == "in_progress"
    
    def test_delete_task_success(self, client):
        """Test deleting a task."""
        # Create project and user first
        project_data = {"name": "Test Project"}
        project_response = client.post("/app/projects/", json=project_data)
        project_id = project_response.json()["id"]
        
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "password": "password123"
        }
        user_response = client.post("/app/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        # Create task
        task_data = {
            "title": "Test Task",
            "project_id": project_id,
            "assignee_id": user_id
        }
        task_response = client.post("/app/tasks/", json=task_data)
        task_id = task_response.json()["id"]
        
        # Delete task
        response = client.delete(f"/app/tasks/{task_id}")
        assert response.status_code == 204
        
        # Verify task is deleted
        get_response = client.get(f"/app/tasks/{task_id}")
        assert get_response.status_code == 404

class TestCommentRouter:
    """Test cases for Comment router endpoints."""
    
    def test_create_comment_success(self, client):
        """Test creating a comment successfully."""
        # Create project, user, and task first
        project_data = {"name": "Test Project"}
        project_response = client.post("/app/projects/", json=project_data)
        project_id = project_response.json()["id"]
        
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "password": "password123"
        }
        user_response = client.post("/app/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        task_data = {
            "title": "Test Task",
            "project_id": project_id,
            "assignee_id": user_id
        }
        task_response = client.post("/app/tasks/", json=task_data)
        task_id = task_response.json()["id"]
        
        # Create comment
        comment_data = {
            "comment": "This is a test comment",
            "task_id": task_id,
            "user_id": user_id
        }
        response = client.post("/app/comments/", json=comment_data)
        assert response.status_code == 201
        data = response.json()
        assert data["comment"] == "This is a test comment"
        assert data["task_id"] == task_id
        assert data["user_id"] == user_id
        assert "id" in data
    
    def test_get_comments_for_task(self, client):
        """Test getting comments for a specific task."""
        # Create project, user, and task first
        project_data = {"name": "Test Project"}
        project_response = client.post("/app/projects/", json=project_data)
        project_id = project_response.json()["id"]
        
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "password": "password123"
        }
        user_response = client.post("/app/users/", json=user_data)
        user_id = user_response.json()["id"]
        
        task_data = {
            "title": "Test Task",
            "project_id": project_id,
            "assignee_id": user_id
        }
        task_response = client.post("/app/tasks/", json=task_data)
        task_id = task_response.json()["id"]
        
        # Create multiple comments
        comment1_data = {
            "comment": "First comment",
            "task_id": task_id,
            "user_id": user_id
        }
        comment2_data = {
            "comment": "Second comment",
            "task_id": task_id,
            "user_id": user_id
        }
        
        client.post("/app/comments/", json=comment1_data)
        client.post("/app/comments/", json=comment2_data)
        
        # Get comments for task
        response = client.get(f"/app/comments/task/{task_id}")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["comment"] in ["First comment", "Second comment"]
        assert data[1]["comment"] in ["First comment", "Second comment"]
