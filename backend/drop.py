# FILE: backend/init_db.py

from app.database import Base, engine  # Update path as needed

# DANGER: This will DROP ALL TABLES and recreate them!
# Good for development, not for production databases.
print("Dropping all tables...")
Base.metadata.drop_all(engine)
print("Creating all tables from models...")
Base.metadata.create_all(engine)
print("Database reset complete.")
