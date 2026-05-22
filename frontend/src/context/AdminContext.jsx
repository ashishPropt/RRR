import { createContext, useContext, useState } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || null);
  const [username, setUsername] = useState(() => localStorage.getItem('admin_username') || null);

  const login = (t, u) => {
    localStorage.setItem('admin_token', t);
    if (u) localStorage.setItem('admin_username', u);
    setToken(t);
    setUsername(u || null);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setToken(null);
    setUsername(null);
  };

  return (
    <AdminContext.Provider value={{ token, username, login, logout, isAuthenticated: !!token }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
