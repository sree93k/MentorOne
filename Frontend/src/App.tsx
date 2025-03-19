

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LoadingSpinner from './common/LoadingSpinner';
import LandingPage from './pages/landingPage/LandingPage';
import { DashboardProps, AuthPageProps } from './types/dashboard';
import './App.css';

// Create theme with primary and secondary colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      dark: '#000000',
      light: '#333333',
    },
    secondary: {
      main: '#FFFFFF',
      dark: '#E5E5E5',
      light: '#F5F5F5',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"',
  },
});

// Lazy load components with proper TypeScript interfaces
const AdminLogin: React.LazyExoticComponent<React.ComponentType<AuthPageProps>> = 
  React.lazy(() => import('./pages/adminAuth/AdminLogin.tsx'));
const AdminDashboard: React.LazyExoticComponent<React.ComponentType<DashboardProps>> = 
  React.lazy(() => import('./pages/adminPages/AdminDashboard.tsx'));
const MentorDashboard: React.LazyExoticComponent<React.ComponentType<DashboardProps>> = 
  React.lazy(() => import('./pages/mentorPages/MentorDashboard.tsx'));
const MenteeDashboard: React.LazyExoticComponent<React.ComponentType<DashboardProps>> = 
  React.lazy(() => import('./pages/menteePages/MenteeDashboard.tsx'));
const Login: React.LazyExoticComponent<React.ComponentType<AuthPageProps>> = 
  React.lazy(() => import('./pages/userAuth/Login.tsx'));
const Register: React.LazyExoticComponent<React.ComponentType<AuthPageProps>> = 
  React.lazy(() => import('./pages/userAuth/Resgister.tsx'));

const DashboardWrapper: React.FC<{ children: React.ReactElement<DashboardProps> }> = ({ children }) => {
  const { user } = useAuth();
  return React.cloneElement(children, { user });
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={
              <React.Suspense fallback={<LoadingSpinner />}>
                <Login />
              </React.Suspense>
            } />
            <Route path="/register" element={
              <React.Suspense fallback={<LoadingSpinner />}>
                <Register />
              </React.Suspense>
            } />

            {/* Admin Login Route */}
            <Route path="/admin" element={
              <React.Suspense fallback={<LoadingSpinner />}>
                <AdminLogin />
              </React.Suspense>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <React.Suspense fallback={<LoadingSpinner />}>
                  <DashboardWrapper>
                    <AdminDashboard user={null} />
                  </DashboardWrapper>
                </React.Suspense>
              </ProtectedRoute>
            } />

            {/* Protected Mentor Routes */}
            <Route path="/mentor/*" element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <React.Suspense fallback={<LoadingSpinner />}>
                  <DashboardWrapper>
                    <MentorDashboard user={null} />
                  </DashboardWrapper>
                </React.Suspense>
              </ProtectedRoute>
            } />

            {/* Protected Mentee Routes */}
            <Route path="/mentee/*" element={
              <ProtectedRoute allowedRoles={['mentee']}>
                <React.Suspense fallback={<LoadingSpinner />}>
                  <DashboardWrapper>
                    <MenteeDashboard user={null} />
                  </DashboardWrapper>
                </React.Suspense>
              </ProtectedRoute>
            } />

            {/* Catch-all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
// const App: React.FC = () => {
//   return (
//     <div>
//       <h1>App</h1>
//     </div>
//   );
// }
// export default App;