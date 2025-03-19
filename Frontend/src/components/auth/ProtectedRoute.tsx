import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles = [],
  }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();
    
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      );
    }
    
    if (!isAuthenticated) {
      // Check if we're trying to access an admin route
      const isAdminRoute = location.pathname.startsWith('/admin');
      
      // Redirect to admin login if accessing admin route, otherwise normal login
      const loginPath = isAdminRoute ? '/AdminLogin' : '/login';
      
      return <Navigate to={loginPath} state={{ from: location }} replace />;
    }
    
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      const dashboardRoutes = {
        admin: '/admin',
        mentor: '/mentor',
        mentee: '/mentee',
      };
      return <Navigate to={dashboardRoutes[user.role]} replace />;
    }
    
    return <>{children}</>;
  };