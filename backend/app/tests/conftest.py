import pytest
import os
import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Set test environment variables
os.environ["TESTING"] = "true"
os.environ["DB_URL"] = "sqlite:///./test.db"
os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"

@pytest.fixture(scope="session")
def test_config():
    """Test configuration fixture."""
    return {
        "database_url": "sqlite:///./test.db",
        "secret_key": "test-secret-key-for-testing-only",
        "testing": True
    }

# Test discovery configuration
def pytest_configure(config):
    """Configure pytest for the project."""
    config.addinivalue_line(
        "markers", "unit: mark test as a unit test"
    )
    config.addinivalue_line(
        "markers", "integration: mark test as an integration test"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow running"
    )

# Test collection configuration
def pytest_collection_modifyitems(config, items):
    """Modify test collection."""
    for item in items:
        # Add markers based on test file names
        if "test_models" in item.nodeid:
            item.add_marker(pytest.mark.unit)
        elif "test_schemas" in item.nodeid:
            item.add_marker(pytest.mark.unit)
        elif "test_utils" in item.nodeid:
            item.add_marker(pytest.mark.unit)
        elif "test_services" in item.nodeid:
            item.add_marker(pytest.mark.unit)
        elif "test_routers" in item.nodeid:
            item.add_marker(pytest.mark.integration)
        else:
            item.add_marker(pytest.mark.unit)
