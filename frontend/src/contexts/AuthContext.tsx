import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  apiLogin,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
} from "@/lib/api";

// ============================================================
// Auth Context — backend JWT auth with role-based access
// Persists session in localStorage via JWT token
// ============================================================

export type Role = "ADMIN" | "ANALYST";

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiLogin(email, password);
      if (res.success) {
        const u = res.data.user as User;
        setUser(u);
        setToken(res.data.token);
        setStoredUser(u);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    removeToken();
    removeStoredUser();
  };

  if (loading) {
    return null; // or a spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === "ADMIN", loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
