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
        <Route path="/users" element={
          <ProtectedRoute roles={["admin"]}>
            <UsersPage />
          </ProtectedRoute>
        } />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
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
