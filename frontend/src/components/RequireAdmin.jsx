import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function RequireAdmin({ children }) {
  const { isAuthenticated } = useAdmin();
  if (!isAuthenticated) return <Navigate to="/admin" replace />;
  return children;
}
