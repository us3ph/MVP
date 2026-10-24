import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import * as api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => api.restoreSession());
  const qc = useQueryClient();
  const loginSso = useCallback(async () => setSession(await api.loginWithSso()), []);
  const login = useCallback(async (credentials) => setSession(await api.login(credentials)), []);
  const logout = useCallback(async () => {
    await api.logout();
    qc.clear();
    setSession(null);
  }, [qc]);
  const value = useMemo(() => ({ session, user: session?.user || null, loginSso, login, logout }), [session, loginSso, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export function RequireAuth({ children }) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
