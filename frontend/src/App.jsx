import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Components
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

// Lazy loaded pages (Placeholders for now)
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const UserDashboard = lazy(() => import('./pages/user/Dashboard'));

// Temporary mock components until we build the real ones
const TempComponent = ({ title }) => <div><h1>{title}</h1></div>;

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
      <Router>
        <Suspense fallback={loadingFallback}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<TempComponent title="Login Page" />} />
            <Route path="/register" element={<TempComponent title="Register Page" />} />
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes inside MainLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                
                {/* Admin Only Routes */}
                <Route element={<RoleRoute requiredRole="Admin" />}>
                  <Route path="/admin/dashboard" element={<TempComponent title="Admin Dashboard" />} />
                  <Route path="/admin/bookings" element={<TempComponent title="Admin Bookings Management" />} />
                </Route>

                {/* User Only Routes */}
                <Route element={<RoleRoute requiredRole="User" />}>
                  <Route path="/user/dashboard" element={<TempComponent title="User Dashboard" />} />
                  <Route path="/user/bookings" element={<TempComponent title="User Bookings History" />} />
                </Route>

              </Route>
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<TempComponent title="404 - Not Found" />} />
          </Routes>
        </Suspense>
      </Router>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
};

export default App;
