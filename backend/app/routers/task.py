from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from models import Task
from app.schemas import task_schema
from typing import List 
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=task_schema.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: task_schema.TaskCreate, db: Session = Depends(get_db)):
    entry = Task(**task.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/", response_model=List[task_schema.TaskResponse])
def list_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@router.get("/{task_id}", response_model=task_schema.TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    entry = db.query(Task).filter(Task.id == task_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Task not found")
    return entry

@router.put("/{task_id}", response_model=task_schema.TaskResponse)
def update_task(task_id: int, patch: task_schema.TaskCreate, db: Session = Depends(get_db)):
    entry = db.query(Task).get(task_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Task not found")
    for var, value in vars(patch).items():
        setattr(entry, var, value) if value is not None else None
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    entry = db.query(Task).get(task_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(entry)
    db.commit()
    return
