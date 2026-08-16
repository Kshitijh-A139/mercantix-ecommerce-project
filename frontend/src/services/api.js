// =============================================================
//  Mercantix — Axios HTTP client
//  Central place for: base URL, JWT injection, error normalisation.
// =============================================================
import axios from "axios";

export const TOKEN_KEY = "mercantix.token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9090",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ── Request: attach JWT (if present) ──────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: normalise errors + auto-logout on 401 ───────────
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("mercantix.user");
      // Only redirect outside the auth pages to avoid loops.
      const p = window.location.pathname;
      if (!p.startsWith("/login") && !p.startsWith("/register") && p !== "/") {
        window.location.assign("/login");
      }
    }

    // Always surface a consistent shape: { message, status, data }
    return Promise.reject({
      status:  error.response?.status ?? 0,
      message: error.response?.data?.message
            || error.response?.data?.error
            || error.message
            || "Network error",
      data:    error.response?.data,
    });
  }
);

export default api;
