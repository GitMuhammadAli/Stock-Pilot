// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { useRouter, usePathname } from "next/navigation";

// interface User {
//   userId: string;
//   email: string;
//   role: string;
//   name: string;
//   isVerified: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const publicRoutes = [
//   '/login',
//   '/register',
//   '/complete-login',
//   '/api',
//   '/_next',
//   '/favicon.ico',
//   '/verify',
//   '/',
// ];

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();

//   const isPublicRoute = () => {
//     return publicRoutes.some(route => pathname?.startsWith(route)) || pathname === '/login';
//   };

//   const logout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//       setUser(null);
//       router.push('/login');
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch('/api/auth/user', { credentials: 'include' });
//         const data = await response.json();
//         console.log("i am hit , " , data)

//         if (data.authenticated) {
//           setUser(data.user);
//         } else {
//           setUser(null);
//           if (!isPublicRoute()) {
//             router.push('/login');
//           }
//         }
//       } catch (error) {
//         console.error("Auth check error:", error);
//         setUser(null);
//         if (!isPublicRoute()) {
//           router.push('/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, [pathname]);

//   return (
//     <AuthContext.Provider value={{ 
//       user , 
//       loading, 
//       logout, 
//       isAuthenticated: !!user 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }


"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  userId: string;
  email: string;
  role: string;
  name: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      console.log(response)

      if (response.ok) {
        const userData = await response.json();
        console.log("user", userData)
        if (userData.authenticated && userData.user) {
          console.log("hey")
          setUser(userData.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

  }, [checkAuth]);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  }, [router]);

  const refreshAuth = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
