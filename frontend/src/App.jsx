import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "./theme";
import "./App.css";
import PublicRoute from "./components/PublicRoute";
import SignupPage from "./pages/SignupPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import ViewProjectPage from "./pages/projects/ViewProjectPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <div className="app">
              <Routes>
                {/* Public routes */}
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                </Route>

                {/* Protected routes for all authenticated users */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  {/* <Route path="/checkpoints" element={<CheckpointsPage />} />
                <Route path="/checkpoints/:id/view" element={<CheckpointViewPage />} /> */}
                </Route>

                {/* Protected routes for super_admin only */}
                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={["super_admin", "project_admin"]}
                    />
                  }
                >
                  <Route path="/projects">
                    <Route index element={<ProjectsPage />} />
                    <Route path="/projects/:id" element={<ViewProjectPage />} />
                  </Route>
                  {/* <Route path="/users" element={<UsersPage />} />
                <Route path="/masters/department" element={<DepartmentMasterPage />} />
                <Route path="/masters/type" element={<TypeMasterPage />} />
                <Route path="/masters/head" element={<HeadMasterPage />} />
                <Route path="/activity-logs" element={<ActivityLogsPage />} />
                <Route path="/checkpoints/new" element={<CheckpointFormPage />} />
                <Route path="/checkpoints/:id/edit" element={<CheckpointFormPage />} /> */}
                </Route>

                {/* Redirect to dashboard if authenticated, otherwise to login */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </div>
          </Router>
        </LocalizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
