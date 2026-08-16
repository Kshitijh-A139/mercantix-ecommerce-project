import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { X, User, Package, MapPin, LogOut, LogIn, UserPlus } from "lucide-react";
import { categories } from "../data/categories";
import { useAuth } from "../context/AuthContext";
import Avatar from "./ui/Avatar";

export default function MobileMenu({ open, onClose }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleLogout = () => { logout(); onClose(); navigate("/"); };

  return (
    <div className="md:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[--color-ink]/40" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-[86%] max-w-sm bg-[--color-ivory] shadow-[--shadow-lift] flex flex-col animate-fade-up">
        <div className="flex items-center justify-between px-5 h-[68px] border-b border-[--color-sand]/70">
          <Link to="/home" onClick={onClose} className="font-display text-xl text-[--color-ink]">
            Mercantix
          </Link>
          <button onClick={onClose} aria-label="Close" className="h-9 w-9 grid place-items-center rounded-full hover:bg-[--color-cream]">
            <X size={18} />
          </button>
        </div>

        {/* User strip */}
        <div className="px-5 py-4 border-b border-[--color-sand]/60">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Avatar name={user?.name} size={40} />
              <div className="min-w-0">
                <p className="font-display text-[15px] text-[--color-ink] truncate">{user?.name}</p>
                <p className="text-xs text-[--color-mist] truncate">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" onClick={onClose} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs tracking-[0.18em] uppercase bg-[--color-ink] text-[--color-ivory]">
                <LogIn size={14} /> Sign In
              </Link>
              <Link to="/register" onClick={onClose} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs tracking-[0.18em] uppercase border border-[--color-ink] text-[--color-ink]">
                <UserPlus size={14} /> Register
              </Link>
            </div>
          )}
        </div>

        {/* Categories */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <p className="px-3 mb-2 eyebrow !text-[--color-mist]">Shop</p>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <NavLink
                  to={`/products?cat=${c.id}`}
                  onClick={onClose}
                  className="block px-3 py-3 font-display text-lg text-[--color-ink] hover:text-[--color-bronze-700] border-b border-[--color-sand]/40"
                >
                  {c.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {isAuthenticated && (
            <>
              <p className="px-3 mt-6 mb-2 eyebrow !text-[--color-mist]">Account</p>
              <ul>
                <MobileLink to="/account" onClose={onClose} icon={<User size={16} />}>My Account</MobileLink>
                <MobileLink to="/orders" onClose={onClose} icon={<Package size={16} />}>My Orders</MobileLink>
                <MobileLink to="/account/addresses" onClose={onClose} icon={<MapPin size={16} />}>Address Book</MobileLink>
                <li>
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-3 text-[--color-ink] hover:bg-[--color-cream]">
                    <LogOut size={16} /> <span className="text-sm">Log Out</span>
                  </button>
                </li>
              </ul>
            </>
          )}
        </nav>
      </aside>
    </div>
  );
}

function MobileLink({ to, icon, onClose, children }) {
  return (
    <li>
      <Link to={to} onClick={onClose} className="flex items-center gap-3 px-3 py-3 text-sm text-[--color-ink] hover:bg-[--color-cream]">
        {icon} {children}
      </Link>
    </li>
  );
}
