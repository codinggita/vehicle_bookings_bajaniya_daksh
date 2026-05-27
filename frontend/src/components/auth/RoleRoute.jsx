import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ requiredRole }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== requiredRole) {
    // If authenticated but wrong role, send to their respective dashboard
    return <Navigate to={user.role === 'Admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
