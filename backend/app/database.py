from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os

DATABASE_URL = os.getenv("DB_URL", "mysql+pymysql://root:kituhitu@localhost/Project_Management")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Add this function that routers need
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
