import { Navigate } from 'react-router-dom';
import { useStore } from '../store';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
} 