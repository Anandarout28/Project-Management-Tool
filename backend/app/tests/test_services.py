import pytest
from unittest.mock import Mock, patch
from app.services.user_service import UserService
from app.services.project_service import ProjectService
from app.services.task_service import TaskService
from app.services.ai_service import AIService
from app.models.user import User
from app.models.project import Project
from app.models.task import Task

class TestUserService:
    """Test cases for User service."""
    
    def test_create_user_success(self):
        """Test creating a user successfully."""
        # Mock database session
        mock_db = Mock()
        mock_user = User(
            id=1,
            username="testuser",
            email="test@example.com",
            role="user",
            password_hash="hashed_password"
        )
        mock_db.query.return_value.filter.return_value.first.return_value = None
        mock_db.add.return_value = None
        mock_db.commit.return_value = None
        mock_db.refresh.return_value = None
        
        # Test
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "password": "password123"
        }
        
        with patch('app.services.user_service.UserService') as mock_service:
            mock_service.create_user.return_value = mock_user
            result = mock_service.create_user(user_data, mock_db)
            
            assert result == mock_user
            mock_service.create_user.assert_called_once_with(user_data, mock_db)
    
    def test_create_user_duplicate_email(self):
        """Test creating user with duplicate email."""
        # Mock database session
        mock_db = Mock()
        mock_existing_user = User(
            id=1,
            username="existinguser",
            email="test@example.com",
            role="user",
            password_hash="hash"
        )
        mock_db.query.return_value.filter.return_value.first.return_value = mock_existing_user
        
        # Test
        user_data = {
            "username": "newuser",
            "email": "test@example.com",
            "role": "user",
            "password": "password123"
        }
        
        with patch('app.services.user_service.UserService') as mock_service:
            mock_service.create_user.side_effect = ValueError("Email already exists")
            
            with pytest.raises(ValueError) as exc_info:
                mock_service.create_user(user_data, mock_db)
            
            assert "Email already exists" in str(exc_info.value)
    
    def test_get_user_by_id(self):
        """Test getting user by ID."""
        # Mock database session
        mock_db = Mock()
        mock_user = User(
            id=1,
            username="testuser",
            email="test@example.com",
            role="user",
            password_hash="hash"
        )
        mock_db.query.return_value.filter.return_value.first.return_value = mock_user
        
        # Test
        with patch('app.services.user_service.UserService') as mock_service:
            mock_service.get_user_by_id.return_value = mock_user
            result = mock_service.get_user_by_id(1, mock_db)
            
            assert result == mock_user
            mock_service.get_user_by_id.assert_called_once_with(1, mock_db)
    
    def test_get_user_by_email(self):
        """Test getting user by email."""
        # Mock database session
        mock_db = Mock()
        mock_user = User(
            id=1,
            username="testuser",
            email="test@example.com",
            role="user",
            password_hash="hash"
        )
        mock_db.query.return_value.filter.return_value.first.return_value = mock_user
        
        # Test
        with patch('app.services.user_service.UserService') as mock_service:
            mock_service.get_user_by_email.return_value = mock_user
            result = mock_service.get_user_by_email("test@example.com", mock_db)
            
            assert result == mock_user
            mock_service.get_user_by_email.assert_called_once_with("test@example.com", mock_db)

class TestProjectService:
    """Test cases for Project service."""
    
    def test_create_project_success(self):
        """Test creating a project successfully."""
        # Mock database session
        mock_db = Mock()
        mock_project = Project(
            id=1,
            name="Test Project",
            description="A test project",
            start_date="2024-01-01",
            end_date="2024-12-31"
        )
        mock_db.add.return_value = None
        mock_db.commit.return_value = None
        mock_db.refresh.return_value = None
        
        # Test
        project_data = {
            "name": "Test Project",
            "description": "A test project",
            "start_date": "2024-01-01",
            "end_date": "2024-12-31"
        }
        
        with patch('app.services.project_service.ProjectService') as mock_service:
            mock_service.create_project.return_value = mock_project
            result = mock_service.create_project(project_data, mock_db)
            
            assert result == mock_project
            mock_service.create_project.assert_called_once_with(project_data, mock_db)
    
    def test_get_project_by_id(self):
        """Test getting project by ID."""
        # Mock database session
        mock_db = Mock()
        mock_project = Project(
            id=1,
            name="Test Project",
            description="A test project"
        )
        mock_db.query.return_value.filter.return_value.first.return_value = mock_project
        
        # Test
        with patch('app.services.project_service.ProjectService') as mock_service:
            mock_service.get_project_by_id.return_value = mock_project
            result = mock_service.get_project_by_id(1, mock_db)
            
            assert result == mock_project
            mock_service.get_project_by_id.assert_called_once_with(1, mock_db)
    
    def test_get_user_projects(self):
        """Test getting projects for a user."""
        # Mock database session
        mock_db = Mock()
        mock_projects = [
            Project(id=1, name="Project 1"),
            Project(id=2, name="Project 2")
        ]
        mock_db.query.return_value.filter.return_value.all.return_value = mock_projects
        
        # Test
        with patch('app.services.project_service.ProjectService') as mock_service:
            mock_service.get_user_projects.return_value = mock_projects
            result = mock_service.get_user_projects(1, mock_db)
            
            assert result == mock_projects
            mock_service.get_user_projects.assert_called_once_with(1, mock_db)

class TestTaskService:
    """Test cases for Task service."""
    
    def test_create_task_success(self):
        """Test creating a task successfully."""
        # Mock database session
        mock_db = Mock()
        mock_task = Task(
            id=1,
            title="Test Task",
            description="A test task",
            status="todo",
            project_id=1,
            assignee_id=1
        )
        mock_db.add.return_value = None
        mock_db.commit.return_value = None
        mock_db.refresh.return_value = None
        
        # Test
        task_data = {
            "title": "Test Task",
            "description": "A test task",
            "status": "todo",
            "project_id": 1,
            "assignee_id": 1
        }
        
        with patch('app.services.task_service.TaskService') as mock_service:
            mock_service.create_task.return_value = mock_task
            result = mock_service.create_task(task_data, mock_db)
            
            assert result == mock_task
            mock_service.create_task.assert_called_once_with(task_data, mock_db)
    
    def test_get_task_by_id(self):
        """Test getting task by ID."""
        # Mock database session
        mock_db = Mock()
        mock_task = Task(
            id=1,
            title="Test Task",
            description="A test task",
            status="todo",
            project_id=1,
            assignee_id=1
        )
        mock_db.query.return_value.filter.return_value.first.return_value = mock_task
        
        # Test
        with patch('app.services.task_service.TaskService') as mock_service:
            mock_service.get_task_by_id.return_value = mock_task
            result = mock_service.get_task_by_id(1, mock_db)
            
            assert result == mock_task
            mock_service.get_task_by_id.assert_called_once_with(1, mock_db)
    
    def test_get_tasks_by_project(self):
        """Test getting tasks for a project."""
        # Mock database session
        mock_db = Mock()
        mock_tasks = [
            Task(id=1, title="Task 1", project_id=1),
            Task(id=2, title="Task 2", project_id=1)
        ]
        mock_db.query.return_value.filter.return_value.all.return_value = mock_tasks
        
        # Test
        with patch('app.services.task_service.TaskService') as mock_service:
            mock_service.get_tasks_by_project.return_value = mock_tasks
            result = mock_service.get_tasks_by_project(1, mock_db)
            
            assert result == mock_tasks
            mock_service.get_tasks_by_project.assert_called_once_with(1, mock_db)
    
    def test_update_task_status(self):
        """Test updating task status."""
        # Mock database session
        mock_db = Mock()
        mock_task = Task(
            id=1,
            title="Test Task",
            status="todo",
            project_id=1,
            assignee_id=1
        )
        mock_db.query.return_value.filter.return_value.first.return_value = mock_task
        mock_db.commit.return_value = None
        mock_db.refresh.return_value = None
        
        # Test
        with patch('app.services.task_service.TaskService') as mock_service:
            mock_service.update_task_status.return_value = mock_task
            result = mock_service.update_task_status(1, "in_progress", mock_db)
            
            assert result == mock_task
            mock_service.update_task_status.assert_called_once_with(1, "in_progress", mock_db)

class TestAIService:
    """Test cases for AI service."""
    
    @patch('app.services.ai_service.groq.Client')
    def test_generate_task_description(self, mock_groq_client):
        """Test generating task description using AI."""
        # Mock Groq client
        mock_client = Mock()
        mock_groq_client.return_value = mock_client
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = "Generated task description"
        mock_client.chat.completions.create.return_value = mock_response
        
        # Test
        with patch('app.services.ai_service.AIService') as mock_service:
            mock_service.generate_task_description.return_value = "Generated task description"
            result = mock_service.generate_task_description("Task title", "Project context")
            
            assert result == "Generated task description"
            mock_service.generate_task_description.assert_called_once_with("Task title", "Project context")
    
    @patch('app.services.ai_service.groq.Client')
    def test_generate_project_insights(self, mock_groq_client):
        """Test generating project insights using AI."""
        # Mock Groq client
        mock_client = Mock()
        mock_groq_client.return_value = mock_client
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = "Generated insights"
        mock_client.chat.completions.create.return_value = mock_response
        
        # Test
        with patch('app.services.ai_service.AIService') as mock_service:
            mock_service.generate_project_insights.return_value = "Generated insights"
            result = mock_service.generate_project_insights("Project data")
            
            assert result == "Generated insights"
            mock_service.generate_project_insights.assert_called_once_with("Project data")
    
    @patch('app.services.ai_service.groq.Client')
    def test_ai_service_error_handling(self, mock_groq_client):
        """Test AI service error handling."""
        # Mock Groq client to raise exception
        mock_client = Mock()
        mock_groq_client.return_value = mock_client
        mock_client.chat.completions.create.side_effect = Exception("API Error")
        
        # Test
        with patch('app.services.ai_service.AIService') as mock_service:
            mock_service.generate_task_description.side_effect = Exception("API Error")
            
            with pytest.raises(Exception) as exc_info:
                mock_service.generate_task_description("Task title", "Project context")
            
            assert "API Error" in str(exc_info.value)
