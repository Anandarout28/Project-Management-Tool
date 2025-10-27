# FILE: app/routers/project.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
import models
from app.schemas import project_schema
from typing import List
# from app.dependencies import get_current_user  # Temporarily commented out for demo

router = APIRouter()

# CREATE Project (Demo mode - no auth required)
@router.post("/", response_model=project_schema.ProjectRead)
def create_project(
    project: project_schema.ProjectCreate,
    db: Session = Depends(get_db)
    # user: models.User = Depends(get_current_user)  # Disabled for demo
):
    # Temporarily disabled role check for demo
    # if user.role not in ("admin", "manager"):
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="You don't have permission to create projects."
    #     )
    
    db_project = models.Project(
        name=project.name,
        description=project.description,
        owner_id=1  # Default owner_id for demo (change as needed)
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# LIST Projects (Demo mode - show all projects)
@router.get("/", response_model=List[project_schema.ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    # user: models.User = Depends(get_current_user)  # Disabled for demo
    # return db.query(models.Project).filter(models.Project.owner_id == user.id).all()  # Original
    return db.query(models.Project).all()  # Demo: show all projects

# GET single project (detail)
@router.get("/{project_id}", response_model=project_schema.ProjectRead)
def get_project(
    project_id: int, 
    db: Session = Depends(get_db)
    # user: models.User = Depends(get_current_user)  # Disabled for demo
):
    # project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.owner_id == user.id).first()  # Original
    project = db.query(models.Project).filter(models.Project.id == project_id).first()  # Demo: any project
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# UPDATE project
@router.put("/{project_id}", response_model=project_schema.ProjectRead)
def update_project(
    project_id: int,
    new_data: project_schema.ProjectCreate,
    db: Session = Depends(get_db)
    # user: models.User = Depends(get_current_user)  # Disabled for demo
):
    # project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.owner_id == user.id).first()  # Original
    project = db.query(models.Project).filter(models.Project.id == project_id).first()  # Demo: any project
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.name = new_data.name
    project.description = new_data.description
    db.commit()
    db.refresh(project)
    return project

# DELETE project
@router.delete("/{project_id}")
def delete_project(
    project_id: int, 
    db: Session = Depends(get_db)
    # user: models.User = Depends(get_current_user)  # Disabled for demo
):
    # project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.owner_id == user.id).first()  # Original
    project = db.query(models.Project).filter(models.Project.id == project_id).first()  # Demo: any project
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"detail": "Project deleted successfully"}
