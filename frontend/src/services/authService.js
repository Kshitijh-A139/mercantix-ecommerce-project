// Auth endpoints — wraps /api/auth/* on the Spring Boot backend.
import api, { TOKEN_KEY } from "./api";

const USER_KEY = "mercantix.user";

export const authService = {
  // POST /api/auth/login → { token, user: { username, email, role } }
  async login({ username, password }) {
    const { data } = await api.post("/api/auth/login", { username, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      username: data.user.username, email: data.user.email, role: data.user.role,
    }));
    return data;
  },

  // POST /api/auth/register → same shape as login
  async register({ username, email, password }) {
    const { data } = await api.post("/api/auth/register", { username, email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      username: data.user.username, email: data.user.email, role: data.user.role,
    }));
    return data;
  },

  // GET /api/auth/me → { username, email, role }
  async me() {
    const { data } = await api.get("/api/auth/me");
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  async logout() {
    try { await api.post("/api/auth/logout"); } catch { /* token expired = still log out */ }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  cachedUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); }
    catch { return null; }
  },

  hasToken() { return !!localStorage.getItem(TOKEN_KEY); },
};
