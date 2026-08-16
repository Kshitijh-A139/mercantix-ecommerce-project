import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../components/ui/Button";
import Input  from "../components/ui/Input";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ username: "", password: "" });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [busy, setBusy]       = useState(false);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await login(form);
    setBusy(false);

    if (!res.ok)              return setError(res.error);
    if (res.role !== "ADMIN") return setError("This account does not have admin access.");

    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className="admin-scope min-h-screen flex items-center justify-center p-4">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[--color-bronze-700]/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[--color-bronze-500]/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-2xl border border-[--color-onyx-700] bg-[--color-onyx-800]/90 backdrop-blur-xl shadow-2xl p-8">
        <div className="flex flex-col items-center text-center mb-7">
          <div className="grid place-items-center h-12 w-12 rounded-xl bg-[--color-bronze-500]/15 ring-1 ring-inset ring-[--color-bronze-500]/30 mb-4">
            <ShieldCheck size={22} className="text-[--color-bronze-300]" />
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[--color-bronze-300]">Admin Portal</p>
          <h1 className="font-display text-3xl text-[--color-ivory] mt-1.5">Mercantix Console</h1>
          <p className="text-sm text-[--color-stone] mt-2">
            Sign in to manage products, orders and customers.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <Input
            label="Username"
            name="username"
            placeholder="admin"
            autoComplete="username"
            value={form.username}
            onChange={onChange}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.password}
              onChange={onChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-2 top-[34px] grid place-items-center h-8 w-8 rounded-md text-[--color-stone] hover:text-[--color-ivory]"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <div className="rounded-md border border-[--color-danger]/30 bg-[--color-danger]/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" disabled={busy} className="w-full">
            <Lock size={14} />
            {busy ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="text-[11px] text-[--color-stone] text-center mt-7">
          Demo admin: <span className="text-[--color-ivory]">admin / admin123</span>
        </p>

        <div className="mt-6 pt-6 border-t border-[--color-onyx-700] text-center">
          <Link to="/" className="text-[11px] tracking-[0.2em] uppercase text-[--color-stone] hover:text-[--color-bronze-300]">
            ← Back to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
