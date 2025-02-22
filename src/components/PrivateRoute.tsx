import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store';

export function PrivateRoute() {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
} 