import React from "react";
import { BrowserRouter, Routes, Route,useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/AuthProvider";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import SignUpPage from "./pages/SignUpPage";
import ProjectList from "./components/Projects/ProjectList";
import ProjectPage from "./pages/ProjectsPage";
import TaskPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";
import TaskList from "./components/Tasks/TaskList";
import { i } from "framer-motion/client";
function AppRoutes() {
  const { user } = useAuth();

  const location = useLocation();

  
  return (
    <Layout>
      <Routes>
      <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/" element={<Dashboard />} />
    <Route path="/projects" element={<ProjectList />} />
    <Route path="/projects/:id" element={<ProjectPage />} />
    <Route path="/tasks" element={<TaskList />} />
    <Route path="/tasks/:id" element={<TaskPage />} />
    <Route path="/profile" element={<ProfilePage />} />
       
        <Route path="/users" element={
          <ProtectedRoute roles={["admin"]}>
            <UsersPage />
          </ProtectedRoute>
        } />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/task" element={<TasksPage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
