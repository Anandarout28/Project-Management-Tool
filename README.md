# Project Management Tool

## 📌 Project Overview

A comprehensive full-stack  Project Management Tool  designed to help teams efficiently manage projects, assign tasks, and track progress in real-time. Built with modern technologies and a focus on user experience, this application provides role-based access control and intuitive interfaces for different user types.

The application supports three primary user roles:
-  Admin:  System-wide oversight, user management, and analytics
-  Manager:  Team management, project oversight, and task assignments  
-  Developer:  Personal task management and project participation

---

## 👨‍💻 Project Information

 Developer Name:  Ananda Kumar Rout 
 Email:  Ananda Kumar 
 Phone:  +91 8114784334
 Submission Date:  October 27, 2025  
 University/Institute:  NIST University, Berhampur, Ganjam, Odisha, 761008
 Program:  Computer Science Engineering (4th Year)

---

## 🛠 Technology Stack

### Backend
-  Framework:  FastAPI (Python)
-  ORM:  SQLAlchemy
-  Authentication:  JWT (JSON Web Tokens)
-  Validation:  Pydantic

### Database
-  Type:  MySQL/MariaDB
-  Version:  5.7+
-  Connection:  PyMySQL via SQLAlchemy

### Frontend
-  Library:  React 18+
-  UI Framework:  Material-UI (MUI)
-  HTTP Client:  Axios
-  Routing:  React Router v6
-  State Management:  React Hooks (useState, useContext)

### Development Tools
-  Version Control:  Git & GitHub
-  API Testing:  Postman
-  IDE:  VS Code
-  Package Manager:  npm (Frontend), pip (Backend)

---

## 🎯 Features Implemented

### ✅ Authentication & Authorization
- User registration and login with JWT tokens
- Secure password hashing using bcrypt
- Role-based access control (Admin, Manager, Developer)
- Token expiration and refresh mechanism

### ✅ Project Management
- Create, read, update, and delete projects
- Assign projects to teams
- Project ownership tracking
- Project description and metadata

### ✅ Task Management
- Full CRUD operations on tasks
- Task status tracking (To Do → In Progress → Done)
- Task assignment to team members
- Due date management
- Task descriptions and detailed information

### ✅ User Management
- User profile management
- Role-based permissions
- User activity tracking
- Edit profile functionality with validation

### ✅ Dashboard & Analytics
- Real-time task statistics
- Project completion metrics
- Task breakdown by status
- User performance overview
- System-wide analytics (Admin only)

### ✅ User Interface
- Responsive design for desktop and mobile
- Role-specific dashboard views
- Professional gradient-based styling
- Smooth animations and transitions
- Intuitive navigation with sidebar menu
- Material-UI components for consistency

### ✅ Error Handling & Validation
- Comprehensive form validation
- API error messages with status codes
- User-friendly error alerts
- Input sanitization and type checking

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 14+ and npm
- MySQL 5.7 or higher
- Git

### Backend Setup

1.  Clone the repository: 
```bash
git clone https://github.com/yourusername/project-management-tool.git
cd project-management-tool/backend
```

2.  Create a virtual environment: 
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3.  Install dependencies: 
```bash
pip install -r requirements.txt
```

4.  Configure database: 
   - Create a MySQL database named `project_management_db`
   - Update `.env` file with your database credentials:
```
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/project_management_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

5.  Run database migrations: 
```bash
python -c "from app.database import Base, engine; Base.metadata.create_all(engine)"
```

6.  Start the backend server: 
```bash
python main.py
```
Backend will run at `http://localhost:8000`

### Frontend Setup

1.  Navigate to frontend directory: 
```bash
cd ../frontend
```

2.  Install dependencies: 
```bash
npm install
```

3.  Configure API endpoint: 
   - Check `src/api/taskApi.js` and similar files
   - Ensure `API_URL` is set to `http://localhost:8000`

4.  Start the development server: 
```bash
npm start
```
Frontend will run at `http://localhost:3000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication Endpoints

 Register User 
```
POST /users/register
Content-Type: application/json

{
  "username": "john_dev",
  "email": "john@company.com",
  "password": "securepass123",
  "role": "developer"
}
```

 User Login 
```
POST /users/login
Content-Type: application/json

{
  "email": "john@company.com",
  "password": "securepass123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_dev",
    "email": "john@company.com",
    "role": "developer"
  }
}
```

### Project Endpoints

 Get All Projects 
```
GET /projects/
Authorization: Bearer <token>
```

 Create Project 
```
POST /projects/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Redesign company website"
}
```

 Update Project 
```
PUT /projects/{project_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign v2",
  "description": "Updated description"
}
```

 Delete Project 
```
DELETE /projects/{project_id}
Authorization: Bearer <token>
```

### Task Endpoints

 Get All Tasks 
```
GET /tasks/
Authorization: Bearer <token>
```

 Create Task 
```
POST /tasks/
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design Homepage",
  "description": "Create mockups for homepage",
  "project_id": 1,
  "assignee_id": 2,
  "status": "todo",
  "due_date": "2025-11-15"
}
```

 Assign Task to User 
```
POST /tasks/{task_id}/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignee_id": 3
}
```

 Update Task Status 
```
PUT /tasks/{task_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress"
}
```

 Delete Task 
```
DELETE /tasks/{task_id}
Authorization: Bearer <token>
```

### Dashboard Endpoints

 Get Dashboard Statistics 
```
GET /stats
Authorization: Bearer <token>
```

### User Endpoints

 Get Current User Profile 
```
GET /users/me
Authorization: Bearer <token>
```

 Update User Profile 
```
PUT /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "john_developer",
  "email": "john.new@company.com"
}
```

---

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'developer') DEFAULT 'developer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  project_id INT NOT NULL,
  assignee_id INT,
  status ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (assignee_id) REFERENCES users(id)
);
```

---

## 🧪 Testing with Postman

1.  Import Postman Collection: 
   - Open Postman
   - Click "Import" and select `PMT_API_Collection.json`

2.  Sample Test Credentials: 
```
Admin Account:
Email: admin@company.com
Password: admin@123

Manager Account:
Email: manager@company.com
Password: manager@123

Developer Account:
Email: developer@company.com
Password: dev@123
```

3.  Test Flow: 
   - Login with any account (copy the token)
   - Create a project
   - Create tasks within the project
   - Assign tasks to team members
   - Track task status changes

---

## 📂 Project Structure

```
project-management-tool/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── task.py
│   │   │   └── comment.py
│   │   ├── schemas/
│   │   │   ├── user_schema.py
│   │   │   ├── project_schema.py
│   │   │   └── task_schema.py
│   │   ├── models.py
│   │   ├── database.py
│   │   └── dependencies.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── LoginPage.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── ProjectForm.jsx
│   │   ├── context/
│   │   │   └── AuthProvider.jsx
│   │   ├── api/
│   │   │   ├── taskApi.js
│   │   │   ├── projectApi.js
│   │   │   └── userApi.js
│   │   ├── hooks/
│   │   │   └── useTasks.js
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── README.md
├── .gitignore
└── PMT_API_Collection.json
```

---

## 💡 Key Features Explained

### Role-Based Dashboard
Each user role sees a customized dashboard:
-  Admin:  System metrics, user management, all projects and tasks
-  Manager:  Team performance, project overview, task distribution
-  Developer:  Personal assignments, project tasks, status tracking

### Task Assignment Flow
1. Create a project
2. Create tasks within the project
3. Assign tasks to team members
4. Track task progress through statuses
5. Update status as work progresses

### Security Features
- Passwords encrypted using bcrypt
- JWT tokens for secure authentication
- SQL injection protection via SQLAlchemy ORM
- CORS enabled for frontend communication
- Input validation on all endpoints

---

## 🐛 Known Issues & Limitations

1.  Current Limitations: 
   - Comments on tasks not yet implemented
   - No email notifications
   - Basic dashboard metrics only
   - No real-time WebSocket updates

2.  Future Enhancements: 
   - Task comments and discussions
   - Email notifications for assignments
   - Gantt charts for timeline visualization
   - Advanced filtering and search
   - Export reports to PDF/Excel
   - Dark mode support
   - Mobile app version

---

## 📈 Performance Considerations

- Database queries optimized with indexes
- JWT token caching on frontend
- Lazy loading for large task lists
- Efficient API pagination (if implemented)
- Reduced re-renders with React hooks

---

## 🔒 Security Best Practices

- Never commit `.env` file with sensitive data
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Regular security audits recommended
- Keep dependencies updated

---

## 📞 Support & Contact

For any issues, questions, or suggestions:

 Developer:  Your Full Name  
 Email:  your.email@example.com  
 GitHub:  https://github.com/yourusername  
 LinkedIn:  https://linkedin.com/in/yourprofile

---

## 📄 License

This project is developed as an internship assignment and is provided as-is for educational purposes.

---

## 🙏 Acknowledgments

- FastAPI for the amazing web framework
- Material-UI for beautiful React components
- SQLAlchemy for ORM excellence
- React for powerful frontend capabilities

---

## ✅ Submission Checklist

- [x] Backend API fully functional
- [x] Frontend UI implemented and styled
- [x] Authentication & authorization working
- [x] Database schema properly designed
- [x] Error handling implemented
- [x] Code documented and commented
- [x] README.md completed
- [x] Postman collection exported
- [x] Git repository initialized
- [x] Project ready for submission

---

 Last Updated:  October 27, 2025  
 Status:  Complete & Ready for Submission ✅

---

*This README was created as part of the Project Management Tool internship assignment. All features have been tested and are working as expected.*
