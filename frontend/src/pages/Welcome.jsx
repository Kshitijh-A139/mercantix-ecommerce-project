import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[--color-ivory] text-[--color-ink] overflow-hidden">

      {/* subtle bronze ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-[--color-bronze-200]/40 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 h-[24rem] w-[24rem] rounded-full bg-[--color-bronze-100]/60 blur-[120px]" />
      </div>

      {/* gentle paper grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(11,15,14,0.06) 0 1px, transparent 1px 60px)," +
            "repeating-linear-gradient(0deg,  rgba(11,15,14,0.06) 0 1px, transparent 1px 60px)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 w-full container-luxe py-6 flex justify-between items-center">
        <Link to="/" className="font-display text-2xl tracking-tight text-[--color-ink]">
          Mercantix
        </Link>
        <Link
          to="/home"
          className="hidden sm:inline-flex items-center gap-1.5 text-[11px] tracking-[0.22em] uppercase text-[--color-mist] hover:text-[--color-bronze-700] transition-colors"
        >
          Browse the store <ArrowRight size={12} />
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto">
        <span className="eyebrow">The Mercantix Edit · 2026</span>

        <h1 className="font-display text-[44px] sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.05] text-[--color-ink] mt-4">
          Considered objects,
          <br />
          <span className="italic text-[--color-bronze-700]">quietly luxurious.</span>
        </h1>

        <p className="text-[--color-mist] text-base md:text-lg max-w-xl mx-auto leading-relaxed mt-6">
          Tailoring, watches, and accessories — sourced and made with intention.
          A wardrobe that earns its place over time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mt-10">
          <Link
            to="/login"
            className="w-full sm:w-48 text-center bg-[--color-ink] text-[--color-ivory] text-xs font-semibold tracking-[0.22em] uppercase py-4 px-8 border border-[--color-ink] hover:bg-[--color-bronze-700] hover:border-[--color-bronze-700] transition-colors shadow-[--shadow-soft]"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-48 text-center bg-transparent text-[--color-ink] text-xs font-semibold tracking-[0.22em] uppercase py-4 px-8 border border-[--color-ink]/30 hover:border-[--color-ink] hover:bg-[--color-ink]/[0.03] transition-all"
          >
            Create Account
          </Link>
        </div>

        <Link
          to="/home"
          className="sm:hidden mt-6 text-[11px] tracking-[0.22em] uppercase text-[--color-mist] hover:text-[--color-bronze-700]"
        >
          Browse without signing in →
        </Link>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full container-luxe py-6 border-t border-[--color-sand]/70 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-[--color-mist]">
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <span className="flex items-center gap-1.5"><Truck size={12} /> Free shipping over $200</span>
          <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> Secure checkout</span>
          <span className="hidden md:flex items-center gap-1.5"><Sparkles size={12} /> 30-day returns</span>
        </div>
        <div className="text-[--color-stone]">
          © {new Date().getFullYear()} Mercantix Studio
        </div>
      </footer>
    </div>
  );
}
