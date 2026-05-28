import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Components
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

// Lazy loaded pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminBookings = lazy(() => import('./pages/admin/Bookings'));
const UserDashboard = lazy(() => import('./pages/user/Dashboard'));
const UserBookings = lazy(() => import('./pages/user/Bookings'));
const Profile = lazy(() => import('./pages/user/Profile'));

// 404 page
const NotFound = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <h1>404 — Page Not Found</h1>
  </Box>
);

const App = () => {
  const { theme: mode } = useSelector((state) => state.ui);

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#aa3bff' },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    },
  });

  const loadingFallback = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Helmet>
        <title>Vehicle Booking Dashboard</title>
        <meta name="description" content="A professional full-stack vehicle booking and management platform with analytics and real-time data." />
        <meta name="keywords" content="vehicle, booking, dashboard, admin, transportation" />
        <meta name="author" content="Daksh" />
      </Helmet>
      <Router>
        <Suspense fallback={loadingFallback}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes inside MainLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>

                {/* Admin Only Routes */}
                <Route element={<RoleRoute requiredRole="Admin" />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/bookings" element={<AdminBookings />} />
                </Route>

                {/* User Only Routes */}
                <Route element={<RoleRoute requiredRole="User" />}>
                  <Route path="/user/dashboard" element={<UserDashboard />} />
                  <Route path="/user/bookings" element={<UserBookings />} />
                </Route>

                {/* Routes accessible to both Admin and User */}
                <Route path="/profile" element={<Profile />} />

              </Route>
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
};

export default App;
