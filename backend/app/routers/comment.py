from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from models import TaskComment
from app.schemas import comment_schema

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=comment_schema.CommentResponse, status_code=status.HTTP_201_CREATED)
def add_comment(comment: comment_schema.CommentCreate, db: Session = Depends(get_db)):
    entry = TaskComment(**comment.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/task/{task_id}", response_model=List[comment_schema.CommentResponse])
def list_comments_for_task(task_id: int, db: Session = Depends(get_db)):
    return db.query(TaskComment).filter(TaskComment.task_id == task_id).all()
