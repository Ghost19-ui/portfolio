import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // 1. If still loading the user state, show a spinner (don't kick them out yet)
  if (loading) return <div className="text-white">Loading...</div>;

  // 2. THE SECURITY CHECK:
  // If no user is found, KICK them back to the Login page immediately.
  return user ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;