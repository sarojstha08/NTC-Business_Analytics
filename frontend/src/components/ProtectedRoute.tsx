import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Wraps routes that require authentication or admin role
export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}
