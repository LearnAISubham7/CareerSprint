import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// App Pages (temporary placeholders for now)
import Today from "../pages/app/Today";
import CreateTask from "../pages/app/CreateTask";
import History from "../pages/app/History";
import Templates from "../pages/app/Templates";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Private App */}
      <Route path="/app" element={<Navigate to="/app/today" replace />} />

      <Route
        path="/app/today"
        element={
          <ProtectedRoute>
            <Today />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/create"
        element={
          <ProtectedRoute>
            <CreateTask />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/templates"
        element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
