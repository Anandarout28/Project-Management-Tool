from fastapi import FastAPI
from app.routers import user, project, task, comment
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="Project Management Tool",
    description="Backend for unique project management app with role-based access",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change ["*"] to your frontend URL in production for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach routers with proper prefixes
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(project.router, prefix="/projects", tags=["Projects"])
app.include_router(task.router, prefix="/tasks", tags=["Tasks"])
app.include_router(comment.router, prefix="/comments", tags=["Comments"])

# Optionally add a root route for health check
@app.get("/")
def read_root():
    return {"message": "Backend running, see /docs for API"}
