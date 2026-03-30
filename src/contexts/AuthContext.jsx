import { createContext, useContext, useState, useEffect } from 'react';
import { loginSimple as loginSimpleAPI, getUser } from '../services/index.js';
import config from '../config/backend.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Auto-login from localStorage
    const savedUser = localStorage.getItem('o2clinic_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsAdmin(config.adminMobiles.includes(parsed.mobile));
      } catch (e) {
        localStorage.removeItem('o2clinic_user');
      }
    }
    setLoading(false);
  }, []);

  async function loginSimple(name, mobile) {
    try {
      const userData = await loginSimpleAPI(name, mobile);
      setUser(userData);
      setIsAdmin(config.adminMobiles.includes(mobile));
      localStorage.setItem('o2clinic_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  }

  function loginAsGuest() {
    const guest = { id: 'guest', name: 'Guest', mobile: '', role: 'guest' };
    setUser(guest);
    setIsAdmin(false);
  }

  function logout() {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('o2clinic_user');
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, loginSimple, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
