import { createContext, useContext, useState, ReactNode } from "react";
import { User, Role, mockUsers } from "@/data/mockData";

// ============================================================
// Auth Context — manages mock login state and role-based access
// Stores user info in React state (no backend needed)
// ============================================================

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Mock login: accepts any password, matches email or falls back to role
  const login = (email: string, _password: string, role: Role): boolean => {
    const found = mockUsers.find((u) => u.email === email && u.role === role);
    if (found) {
      setUser(found);
      return true;
    }
    // Fallback: create user from role if email doesn't match
    const fallback = mockUsers.find((u) => u.role === role);
    if (fallback) {
      setUser({ ...fallback, email });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === "Admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
