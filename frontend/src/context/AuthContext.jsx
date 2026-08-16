import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user: { username, email, role } | null
  const [user, setUser]       = useState(() => authService.cachedUser());
  const [loading, setLoading] = useState(authService.hasToken());   // true while we re-verify token on boot
  const [error, setError]     = useState(null);

  // ── Boot: if we have a token in storage, re-verify against /api/auth/me ──
  useEffect(() => {
    if (!authService.hasToken()) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const me = await authService.me();
        if (!cancelled) setUser(me);
      } catch {
        // 401 interceptor already clears storage
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── login(credentials) ────────────────────────────────────────
  const login = useCallback(async ({ username, password }) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.login({ username, password });
      const u = { username: data.user.username, email: data.user.email, role: data.user.role };
      setUser(u);
      toast.success(`Welcome back, ${u.username}.`);
      return { ok: true, role: u.role };
    } catch (e) {
      const msg = e.message || "Sign-in failed.";
      setError(msg);
      toast.error(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── register({ username, email, password }) ───────────────────
  const register = useCallback(async ({ username, email, password }) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.register({ username, email, password });
      const u = { username: data.user.username, email: data.user.email, role: data.user.role };
      setUser(u);
      toast.success("Account created", { description: "Welcome to Mercantix." });
      return { ok: true, role: u.role };
    } catch (e) {
      const msg = e.message || "Registration failed.";
      setError(msg);
      toast.error(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── logout() ──────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    toast("Signed out", { description: "See you soon." });
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
