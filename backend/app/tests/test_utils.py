import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from app.utils.auth import get_current_user, require_roles
from app.utils.security import SECRET_KEY
from app.models.user import User

class TestAuthUtils:
    """Test cases for authentication utilities."""
    
    @patch('app.utils.auth.jwt.decode')
    @patch('app.utils.auth.db.query')
    def test_get_current_user_success(self, mock_query, mock_jwt_decode):
        """Test getting current user with valid token."""
        # Mock JWT decode
        mock_jwt_decode.return_value = {"user_id": 1}
        
        # Mock database query
        mock_user = User(
            id=1,
            username="testuser",
            email="test@example.com",
            role="user",
            password_hash="hash"
        )
        mock_query.return_value.filter.return_value.first.return_value = mock_user
        
        # Test
        token = "valid_token"
        result = get_current_user(token)
        
        assert result == mock_user
        mock_jwt_decode.assert_called_once_with(token, SECRET_KEY, algorithms=["HS256"])
    
    @patch('app.utils.auth.jwt.decode')
    def test_get_current_user_invalid_token(self, mock_jwt_decode):
        """Test getting current user with invalid token."""
        # Mock JWT decode to raise exception
        mock_jwt_decode.side_effect = Exception("Invalid token")
        
        # Test
        token = "invalid_token"
        with pytest.raises(HTTPException) as exc_info:
            get_current_user(token)
        
        assert exc_info.value.status_code == 401
        assert "Could not validate credentials" in exc_info.value.detail
    
    @patch('app.utils.auth.jwt.decode')
    @patch('app.utils.auth.db.query')
    def test_get_current_user_not_found(self, mock_query, mock_jwt_decode):
        """Test getting current user when user not found in database."""
        # Mock JWT decode
        mock_jwt_decode.return_value = {"user_id": 1}
        
        # Mock database query to return None
        mock_query.return_value.filter.return_value.first.return_value = None
        
        # Test
        token = "valid_token"
        with pytest.raises(HTTPException) as exc_info:
            get_current_user(token)
        
        assert exc_info.value.status_code == 401
        assert "Could not validate credentials" in exc_info.value.detail
    
    def test_require_roles_success(self):
        """Test require_roles with valid user role."""
        # Mock user
        mock_user = User(
            id=1,
            username="testuser",
            email="test@example.com",
            role="admin",
            password_hash="hash"
        )
        
        # Test
        role_dependency = require_roles("admin", "manager")
        result = role_dependency(mock_user)
        
        assert result == mock_user
    
    def test_require_roles_insufficient_privileges(self):
        """Test require_roles with insufficient privileges."""
        # Mock user
        mock_user = User(
            id=1,
            username="testuser",
            email="test@example.com",
            role="user",
            password_hash="hash"
        )
        
        # Test
        role_dependency = require_roles("admin", "manager")
        with pytest.raises(HTTPException) as exc_info:
            role_dependency(mock_user)
        
        assert exc_info.value.status_code == 403
        assert "Insufficient privileges" in exc_info.value.detail

class TestSecurityUtils:
    """Test cases for security utilities."""
    
    def test_secret_key_generation(self):
        """Test that secret key is generated."""
        assert SECRET_KEY is not None
        assert isinstance(SECRET_KEY, str)
        assert len(SECRET_KEY) > 0

class TestValidators:
    """Test cases for validation utilities."""
    
    def test_email_validation(self):
        """Test email validation."""
        from app.utils.validators import validate_email
        
        # Valid emails
        assert validate_email("test@example.com") == True
        assert validate_email("user.name@domain.co.uk") == True
        assert validate_email("test+tag@example.org") == True
        
        # Invalid emails
        assert validate_email("invalid-email") == False
        assert validate_email("@example.com") == False
        assert validate_email("test@") == False
        assert validate_email("") == False
    
    def test_password_validation(self):
        """Test password validation."""
        from app.utils.validators import validate_password
        
        # Valid passwords
        assert validate_password("password123") == True
        assert validate_password("MySecure123!") == True
        assert validate_password("a" * 8) == True
        
        # Invalid passwords
        assert validate_password("short") == False
        assert validate_password("") == False
        assert validate_password("12345678") == False  # No letters
    
    def test_username_validation(self):
        """Test username validation."""
        from app.utils.validators import validate_username
        
        # Valid usernames
        assert validate_username("testuser") == True
        assert validate_username("user123") == True
        assert validate_username("test_user") == True
        
        # Invalid usernames
        assert validate_username("") == False
        assert validate_username("a") == False  # Too short
        assert validate_username("a" * 51) == False  # Too long
        assert validate_username("user@name") == False  # Invalid characters
        assert validate_username("user name") == False  # Spaces not allowed
