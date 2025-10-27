import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLoader } from "./DashboardLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && user) {
      const role = user.user_metadata?.role;
      if (role === "student" && window.location.pathname.startsWith("/admin")) {
        navigate("/student");
      } else if (role === "admin" && window.location.pathname.startsWith("/student")) {
        navigate("/admin");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <DashboardLoader onComplete={() => {}} />;
  }

  if (!user) return null;

  return <>{children}</>;
}
