import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.error("Error parsing user from localStorage:", e);
    // Handle cases where localStorage 'user' might be malformed
  }

  // Check if token exists AND user data exists AND user role is admin
  if (!token || !user || user.role !== "admin") {
    // Redirect to login if not authenticated or not an admin
    return <Navigate to="/login" replace />; // Use replace to prevent going back to protected route
  }

  return children; // Render the protected content
}