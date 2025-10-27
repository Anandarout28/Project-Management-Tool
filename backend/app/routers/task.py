# FILE: app/routers/task.py
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from app.database import get_db
import models
from app.schemas import task_schema
from typing import List
from pydantic import BaseModel
from app.dependencies import get_current_user

router = APIRouter(tags=["Tasks"])


class AssignModel(BaseModel):
    assignee_id: int

# CREATE Task
@router.post("/", response_model=task_schema.TaskRead)
def create_task(
    task: task_schema.TaskCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    project = db.query(models.Project).filter(
        models.Project.id == task.project_id,
        models.Project.owner_id == user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db_task = models.Task(
        title=task.title,
        description=task.description,
        status=task.status,
        project_id=task.project_id,
        assignee_id=task.assignee_id,
        due_date=task.due_date
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# LIST tasks for a project (or all owned projects)
@router.get("/", response_model=List[task_schema.TaskRead])
def list_tasks(
    project_id: int = None,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    query = db.query(models.Task).join(models.Project)
    if project_id is not None:
        query = query.filter(models.Task.project_id == project_id)
    else:
        query = query.filter(models.Project.owner_id == user.id)
    return query.all()

# GET single task (detail)
@router.get("/{task_id}", response_model=task_schema.TaskRead)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).join(models.Project).filter(
        models.Task.id == task_id,
        models.Project.owner_id == user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# UPDATE task
@router.put("/{task_id}", response_model=task_schema.TaskRead)
def update_task(
    task_id: int,
    new_data: task_schema.TaskCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).join(models.Project).filter(
        models.Task.id == task_id, models.Project.owner_id == user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.title = new_data.title
    task.description = new_data.description
    task.status = new_data.status
    task.assignee_id = new_data.assignee_id
    task.due_date = new_data.due_date
    db.commit()
    db.refresh(task)
    return task

# DELETE task
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).join(models.Project).filter(
        models.Task.id == task_id,
        models.Project.owner_id == user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted"}

# ASSIGN task to user
@router.post("/{task_id}/assign")
def assign_task(
    task_id: int,
    assignment: AssignModel = Body(...),
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).join(models.Project).filter(
        models.Task.id == task_id,
        models.Project.owner_id == user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.assignee_id = assignment.assignee_id
    db.commit()
    db.refresh(task)
    return {"detail": "Task assigned successfully", "assignee_id": task.assignee_id}
