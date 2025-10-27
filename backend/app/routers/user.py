from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from app.database import SessionLocal
from models import User
from app.schemas import user_schema
from typing import List
from app.utils.security import hash_password, verify_password
from jose import jwt
import os
from sqlalchemy.exc import IntegrityError
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SECRET_KEY = os.environ.get("SECRET_KEY", "supersecret")
ALGORITHM = "HS256"

# ---------- LOGIN ----------
@router.post("/login")
def login(
    email: str = Form(...), 
    password: str = Form(...), 
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    payload = {"user_id": user.id, "role":str( user.role)}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

# ---------- REGISTER ----------
@router.post("/", response_model=user_schema.UserResponse)
def register_user(user_data: user_schema.UserCreate, db: Session = Depends(get_db)):
    print("DEBUG incoming registration data:", user_data.dict())

    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user_data.password)
    user_obj = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_pw,
        role=user_data.role
    )
    db.add(user_obj)
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        print("DB Error:", str(e))
        raise HTTPException(status_code=400, detail="Database error: {}".format(e.orig))
    db.refresh(user_obj)
    return user_obj

# ---------- GET ALL USERS ----------
@router.get("/", response_model=List[user_schema.UserRead])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()
