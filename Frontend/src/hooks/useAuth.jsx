import { useState, useEffect, createContext, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ft_token');
    if (token) {
      api.getMe()
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('ft_token');
          localStorage.removeItem('ft_session');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    localStorage.setItem('ft_token', res.data.token);
    if (res.data.sessionToken) localStorage.setItem('ft_session', res.data.sessionToken);
    setUser(res.data.user);
    return res;
  };

  const register = async (data) => {
    const res = await api.register(data);
    localStorage.setItem('ft_token', res.data.token);
    if (res.data.sessionToken) localStorage.setItem('ft_session', res.data.sessionToken);
    setUser(res.data.user);
    return res;
  };

  const googleLogin = async (credential) => {
    const res = await api.googleAuth({ credential });
    localStorage.setItem('ft_token', res.data.token);
    if (res.data.sessionToken) localStorage.setItem('ft_session', res.data.sessionToken);
    setUser(res.data.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('ft_token');
    localStorage.removeItem('ft_session');
    setUser(null);
  };

  const updateUser = (data) => setUser(prev => ({ ...prev, ...data }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
