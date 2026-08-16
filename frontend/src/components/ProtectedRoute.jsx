import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // While the AuthContext re-verifies a stored token on boot, don't redirect.
  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[--color-mist]">
          <div className="h-6 w-6 rounded-full border-2 border-[--color-mist] border-t-transparent animate-spin" />
          <span className="text-xs tracking-[0.18em] uppercase">Checking session</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const target = requireAdmin ? "/admin/login" : "/login";
    return <Navigate to={target} state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
