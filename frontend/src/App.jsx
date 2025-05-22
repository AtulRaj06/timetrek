import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import CheckpointsPage from './pages/CheckpointsPage';
import CheckpointFormPage from './pages/CheckpointFormPage';
import CheckpointViewPage from './pages/CheckpointViewPage';
import ActivityLogsPage from './pages/ActivityLogsPage';
import DepartmentMasterPage from './pages/DepartmentMasterPage';
import TypeMasterPage from './pages/TypeMasterPage';
import HeadMasterPage from './pages/HeadMasterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import './App.css';
import PublicRoute from './components/PublicRoute';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public routes */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>
              
              {/* Protected routes for all authenticated users */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/checkpoints" element={<CheckpointsPage />} />
                <Route path="/checkpoints/:id/view" element={<CheckpointViewPage />} />
              </Route>
              
              {/* Protected routes for super_admin only */}
              <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
                <Route path="/users" element={<UsersPage />} />
                <Route path="/masters/department" element={<DepartmentMasterPage />} />
                <Route path="/masters/type" element={<TypeMasterPage />} />
                <Route path="/masters/head" element={<HeadMasterPage />} />
                <Route path="/activity-logs" element={<ActivityLogsPage />} />
                <Route path="/checkpoints/new" element={<CheckpointFormPage />} />
                <Route path="/checkpoints/:id/edit" element={<CheckpointFormPage />} />
              </Route>
              
              {/* Redirect to dashboard if authenticated, otherwise to login */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;