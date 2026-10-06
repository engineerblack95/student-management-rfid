import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, getUser, saveAuth, clearAuth } from '../services/auth';
import { authLogin, authRegister, authMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate token on mount
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authMe()
      .then((res) => setUser(res.data.data.user))
      .catch(() => {
        clearAuth();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await authLogin(credentials);
    const { user, token } = res.data.data;
    saveAuth(token, user);
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const res = await authRegister(data);
    const { user, token } = res.data.data;
    saveAuth(token, user);
    setUser(user);
    return user;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);