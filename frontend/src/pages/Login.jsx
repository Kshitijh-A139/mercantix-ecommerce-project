import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/home";

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(form);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(result.role === "ADMIN" ? "/admin/dashboard" : from, { replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-[--color-ivory]">
      {/* Editorial image */}
      <aside className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80&auto=format"
          alt="Mercantix editorial"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/30" />
        <div className="relative h-full flex flex-col justify-between p-10 text-[--color-ivory]">
          <Link to="/" className="font-display text-2xl">Mercantix</Link>
          <div className="max-w-md">
            <p className="eyebrow !text-[--color-bronze-200]">Welcome back</p>
            <h2 className="font-display text-4xl xl:text-5xl mt-2 leading-tight">
              Step back into the
              <br /> Mercantix wardrobe.
            </h2>
            <p className="mt-4 text-sm opacity-85">
              Sign in to access your orders, saved looks, and member-only releases.
            </p>
          </div>
        </div>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden font-display text-2xl text-[--color-ink]">
            Mercantix
          </Link>
          <div className="mt-6 lg:mt-0">
            <span className="eyebrow">Sign In</span>
            <h1 className="font-display text-3xl md:text-4xl text-[--color-ink] mt-2">
              Hello again.
            </h1>
            <p className="text-sm text-[--color-mist] mt-2">
              New to Mercantix?{" "}
              <Link to="/register" className="text-[--color-bronze-700] underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
            <InputField
              label="Username"
              type="text"
              name="username"
              autoComplete="username"
              placeholder="your username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <InputField
                label="Password"
                type={showPw ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-0 top-8 p-1 text-[--color-mist] hover:text-[--color-ink]"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[--color-mist] cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 accent-[--color-bronze-600]"
                />
                Remember me
              </label>
              <Link to="#" className="text-[--color-bronze-700] hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="rounded-sm border border-[--color-danger]/30 bg-[--color-danger]/5 px-3 py-2 text-xs text-[--color-danger]">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Signing in…" : "Sign In"}
            </Button>

            <p className="text-[11px] text-[--color-mist] text-center mt-2">
              Demo customer: <span className="text-[--color-ink]">demo / customer123</span>
              <br />
              Admin: <span className="text-[--color-ink]">admin / admin123</span>
            </p>
          </form>

          <p className="mt-10 text-[11px] tracking-[0.18em] uppercase text-[--color-mist] text-center">
            <Link to="/admin/login" className="hover:text-[--color-bronze-700]">
              Admin Sign-in →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
