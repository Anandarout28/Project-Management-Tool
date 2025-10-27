from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from models import User
from app.database import SessionLocal
from sqlalchemy.orm import Session
import os


SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = "HS256"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str, db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("user_id"))
    except (JWTError, ValueError):
        raise credentials_exception
    user = db.query(user).filter(user.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

def require_roles(*roles):
    def _role_dependency(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient privileges"
            )
        return user
    return _role_dependency
