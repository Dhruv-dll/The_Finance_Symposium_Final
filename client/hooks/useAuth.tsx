import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import CryptoJS from 'crypto-js';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Encrypted credentials (in production, these would be in environment variables)
const ENCRYPTED_USERNAME = CryptoJS.AES.encrypt('TFSadmin', 'tfs-secret-key-2024').toString();
const ENCRYPTED_PASSWORD = CryptoJS.AES.encrypt('TFSG&#^yOW$kMA08=ryCb+R', 'tfs-secret-key-2024').toString();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (with expiry)
    const authData = localStorage.getItem('tfs-admin-auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const now = new Date().getTime();
        
        // Check if session is still valid (24 hours)
        if (parsed.expiry && now < parsed.expiry) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('tfs-admin-auth');
        }
      } catch (error) {
        localStorage.removeItem('tfs-admin-auth');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    try {
      // Decrypt stored credentials
      const decryptedUsername = CryptoJS.AES.decrypt(ENCRYPTED_USERNAME, 'tfs-secret-key-2024').toString(CryptoJS.enc.Utf8);
      const decryptedPassword = CryptoJS.AES.decrypt(ENCRYPTED_PASSWORD, 'tfs-secret-key-2024').toString(CryptoJS.enc.Utf8);

      if (username === decryptedUsername && password === decryptedPassword) {
        setIsAuthenticated(true);
        
        // Store authentication with 24-hour expiry
        const authData = {
          authenticated: true,
          expiry: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
        };
        localStorage.setItem('tfs-admin-auth', JSON.stringify(authData));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tfs-admin-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
