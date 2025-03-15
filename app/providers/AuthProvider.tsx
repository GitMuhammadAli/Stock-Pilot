"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from 'js-cookie';

interface User {
  userId: string;
  email: string;
  role: string;
  name: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = [
  '/login',
  '/register',
  '/complete-login',
  '/api',
  '/_next',
  '/favicon.ico',
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = () => {
    return publicRoutes.some(route => pathname?.startsWith(route)) || pathname === '/login';
  };

  // Store token in cookie and set user
  const login = async (token: string) => {
    Cookies.set('authToken', token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    try {
      // Get user data from the backend instead of decoding on client
      const response = await fetch('/api/auth/user');
      const data = await response.json();
      
      if (data.authenticated) {
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Failed to get user data');
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      // Handle error - maybe logout or retry
      Cookies.remove('authToken', { path: '/' });
      setUser(null);
    }
  };

  // Remove token and user data
  const logout = () => {
    Cookies.remove('authToken', { path: '/' });
    setUser(null);
    router.push('/login');
  };

  // Check authentication status on mount and when token changes
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Check if cookie exists
        const token = Cookies.get('authToken');
        
        if (!token) {
          setUser(null);
          if (!isPublicRoute()) {
            router.push('/login');
          }
          setLoading(false);
          return;
        }
        
        const response = await fetch('/api/auth/user');
        const data = await response.json();
        
        if (data.authenticated) {
          setUser(data.user);
        } else {
          Cookies.remove('authToken', { path: '/' });
          setUser(null);
          if (!isPublicRoute()) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        Cookies.remove('authToken', { path: '/' });
        setUser(null);
        if (!isPublicRoute()) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    
    checkAuth();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
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
