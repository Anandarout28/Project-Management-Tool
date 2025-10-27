import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.models.project_member import ProjectMember
from app.database import Base

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

class TestUserModel:
    """Test cases for User model."""
    
    def test_create_user(self, db_session):
        """Test creating a user."""
        user = User(
            username="testuser",
            email="test@example.com",
            role="user",
            password_hash="hashedpassword"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        
        assert user.id is not None
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.role == "user"
    
    def test_user_email_unique(self, db_session):
        """Test that user email must be unique."""
        user1 = User(
            username="user1",
            email="test@example.com",
            role="user",
            password_hash="hash1"
        )
        user2 = User(
            username="user2",
            email="test@example.com",
            role="user",
            password_hash="hash2"
        )
        
        db_session.add(user1)
        db_session.commit()
        
        db_session.add(user2)
        with pytest.raises(Exception):  # Should raise integrity error
            db_session.commit()

class TestProjectModel:
    """Test cases for Project model."""
    
    def test_create_project(self, db_session):
        """Test creating a project."""
        project = Project(
            name="Test Project",
            description="A test project",
            start_date="2024-01-01",
            end_date="2024-12-31"
        )
        db_session.add(project)
        db_session.commit()
        db_session.refresh(project)
        
        assert project.id is not None
        assert project.name == "Test Project"
        assert project.description == "A test project"
    
    def test_project_name_required(self, db_session):
        """Test that project name is required."""
        project = Project(description="No name project")
        db_session.add(project)
        with pytest.raises(Exception):  # Should raise integrity error
            db_session.commit()

class TestTaskModel:
    """Test cases for Task model."""
    
    def test_create_task(self, db_session):
        """Test creating a task."""
        # First create a project
        project = Project(name="Test Project")
        db_session.add(project)
        db_session.commit()
        db_session.refresh(project)
        
        # Create a user
        user = User(
            username="testuser",
            email="test@example.com",
            role="user",
            password_hash="hash"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        
        # Create task
        task = Task(
            title="Test Task",
            description="A test task",
            status="todo",
            project_id=project.id,
            assignee_id=user.id
        )
        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)
        
        assert task.id is not None
        assert task.title == "Test Task"
        assert task.project_id == project.id
        assert task.assignee_id == user.id
    
    def test_task_status_enum(self, db_session):
        """Test task status enum values."""
        project = Project(name="Test Project")
        db_session.add(project)
        db_session.commit()
        db_session.refresh(project)
        
        task = Task(
            title="Test Task",
            project_id=project.id,
            status="invalid_status"
        )
        db_session.add(task)
        with pytest.raises(Exception):  # Should raise validation error
            db_session.commit()

class TestProjectMemberModel:
    """Test cases for ProjectMember model."""
    
    def test_create_project_member(self, db_session):
        """Test creating a project member."""
        # Create project and user first
        project = Project(name="Test Project")
        user = User(
            username="testuser",
            email="test@example.com",
            role="user",
            password_hash="hash"
        )
        db_session.add(project)
        db_session.add(user)
        db_session.commit()
        db_session.refresh(project)
        db_session.refresh(user)
        
        # Create project member
        member = ProjectMember(
            project_id=project.id,
            user_id=user.id,
            role="developer"
        )
        db_session.add(member)
        db_session.commit()
        db_session.refresh(member)
        
        assert member.id is not None
        assert member.project_id == project.id
        assert member.user_id == user.id
        assert member.role == "developer"
    
    def test_project_member_unique_constraint(self, db_session):
        """Test that user can only be member of project once."""
        project = Project(name="Test Project")
        user = User(
            username="testuser",
            email="test@example.com",
            role="user",
            password_hash="hash"
        )
        db_session.add(project)
        db_session.add(user)
        db_session.commit()
        db_session.refresh(project)
        db_session.refresh(user)
        
        # Create first membership
        member1 = ProjectMember(
            project_id=project.id,
            user_id=user.id,
            role="developer"
        )
        db_session.add(member1)
        db_session.commit()
        
        # Try to create duplicate membership
        member2 = ProjectMember(
            project_id=project.id,
            user_id=user.id,
            role="manager"
        )
        db_session.add(member2)
        with pytest.raises(Exception):  # Should raise integrity error
            db_session.commit()
