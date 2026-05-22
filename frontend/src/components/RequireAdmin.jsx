import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

export default function RequireAdmin({ children }) {
  const { isAuthenticated, token, logout } = useAdmin();
  const [verified, setVerified] = useState(null); // null = checking, true = ok, false = invalid

  useEffect(() => {
    if (!isAuthenticated) {
      setVerified(false);
      return;
    }
    // Verify token is still valid against the server
    axios.get('/api/admin/blog/stats', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setVerified(true);
    }).catch(() => {
      // Token invalid (e.g., server restarted) — clear it and send to login
      logout();
      setVerified(false);
    });
  }, [token, isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/admin" replace />;
  if (verified === null) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-400 text-sm">Verifying session...</div>
    </div>
  );
  if (verified === false) return <Navigate to="/admin" replace />;
  return children;
}
