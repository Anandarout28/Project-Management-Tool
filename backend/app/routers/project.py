from app.database import SessionLocal
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from models import Project
from app.schemas import project_schema
from app.utils.auth import require_roles, get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post(
    "/",
    response_model=project_schema.ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles("admin", "manager"))]
)
def create_project(
    payload: project_schema.ProjectCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    project = Project(**payload.dict())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project
