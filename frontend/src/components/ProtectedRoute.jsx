import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import Header from './Header';
import { useIdleTimer } from 'react-idle-timer/legacy'

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated, logout } = useAuth();

  const onIdle = () => {
    logout();
  }

  useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * 30, // 30 minutes
    throttle: 500
  })
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // User doesn't have required role, redirect to dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has required role, render the route
  return (
  <div className="layout">
    <Header />
    <div style={{marginTop: '64px', height: 'calc(100vh - 64px)', overflowY: 'scroll'}}>
      <Outlet />
    </div>
  </div>
  )
};

export default ProtectedRoute;