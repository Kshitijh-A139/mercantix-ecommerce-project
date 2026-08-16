import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
    address: "",
    newsletter: true,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.firstName || !form.lastName) return setError("Please enter your full name.");
    if (!form.username || form.username.length < 3) return setError("Please choose a username (3+ characters).");
    if (!form.email.includes("@")) return setError("Please enter a valid email.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setSubmitting(true);
    const res = await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    });
    setSubmitting(false);

    if (!res.ok) return setError(res.error);
    navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-[--color-ivory]">
      <main className="order-2 lg:order-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden font-display text-2xl text-[--color-ink]">
            Mercantix
          </Link>
          <div className="mt-6 lg:mt-0">
            <span className="eyebrow">Create an account</span>
            <h1 className="font-display text-3xl md:text-4xl text-[--color-ink] mt-2">
              Join Mercantix.
            </h1>
            <p className="text-sm text-[--color-mist] mt-2">
              Already a member?{" "}
              <Link to="/login" className="text-[--color-bronze-700] underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-5">
              <InputField label="First name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Aria" required />
              <InputField label="Last name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Sterling" required />
            </div>
            <InputField label="Username" name="username" autoComplete="username" placeholder="aria_s" value={form.username} onChange={handleChange} required />
            <InputField label="Email" type="email" name="email" autoComplete="email" placeholder="you@email.com" value={form.email} onChange={handleChange} required />
            <InputField label="Password" type="password" name="password" autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required />
            <InputField label="Confirm password" type="password" name="confirm" autoComplete="new-password" placeholder="Repeat password" value={form.confirm} onChange={handleChange} required />
            <InputField label="Shipping address" name="address" placeholder="Street, city, postal code" value={form.address} onChange={handleChange} />

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="newsletter"
                checked={form.newsletter}
                onChange={handleChange}
                className="mt-1 h-3.5 w-3.5 accent-[--color-bronze-600]"
              />
              <span className="text-xs text-[--color-mist] leading-relaxed">
                <span className="text-[--color-ink]">Newsletter sign-up.</span>{" "}
                Receive early access to new arrivals, member-only previews, and editorial features.
              </span>
            </label>

            {error && (
              <div className="rounded-sm border border-[--color-danger]/30 bg-[--color-danger]/5 px-3 py-2 text-xs text-[--color-danger]">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Creating account…" : "Create Account"}
            </Button>

            <p className="text-[11px] text-[--color-mist] text-center">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-[--color-ink] hover:underline">Terms</a> &{" "}
              <a href="#" className="text-[--color-ink] hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </main>

      <aside className="order-1 lg:order-2 hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80&auto=format"
          alt="Mercantix editorial"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-black/40 via-transparent to-black/30" />
        <div className="relative h-full flex flex-col justify-between p-10 text-[--color-ivory]">
          <div className="flex justify-end">
            <Link to="/" className="font-display text-2xl">Mercantix</Link>
          </div>
          <div className="max-w-md">
            <p className="eyebrow !text-[--color-bronze-200]">Inner Circle</p>
            <h2 className="font-display text-4xl xl:text-5xl mt-2 leading-tight">
              Join our community
              <br /> of considered dressers.
            </h2>
            <p className="mt-4 text-sm opacity-85">
              Early drops, complimentary alterations, private fittings — your
              membership begins the moment you sign up.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
