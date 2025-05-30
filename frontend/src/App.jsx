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
import TimelogsPage from "./pages/timelogs/TimelogsPage";
import AdminPage from "./pages/admin/AdminPage";

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
                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={["super_admin", "project_admin", "user"]}
                    />
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/projects">
                    <Route index element={<ProjectsPage />} />
                    <Route
                      path="/projects/:projectId/timelog"
                      element={<TimelogsPage />}
                    />
                  </Route>

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute
                        allowedRoles={["super_admin", "project_admin"]}
                      />
                    }
                  >
                    <Route index element={<AdminPage />} />
                    <Route
                      path="/admin/projects/:projectId/users"
                      element={<ViewProjectPage />}
                    />
                    {/* <Route
                        path="/:projectId/"
                        // element={<TimelogsPage />}
                      /> */}
                  </Route>
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
