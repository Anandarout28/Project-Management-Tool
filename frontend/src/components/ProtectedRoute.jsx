import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

// Required role is optional: if specified, user must have that role or be admin.
export function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role) && user.role !== "admin") {
    return <div>Forbidden: insufficient privileges.</div>;
  }
  return children;
}
