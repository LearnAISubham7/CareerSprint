import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // while /me is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="rounded-3xl border px-6 py-4 text-sm font-medium shadow-sm"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          Loading your workspace...
        </div>
      </div>
    );
  }

  // if not logged in
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
