import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, LogOut, X } from "lucide-react";

export const ADMIN_NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products",  label: "Products",  icon: Package },
  { to: "/admin/orders",    label: "Orders",    icon: ShoppingCart },
  { to: "/admin/users",     label: "Users",     icon: Users },
  { to: "/admin/sales",     label: "Sales",     icon: BarChart3 },
];

export default function Sidebar({ open, onClose, onLogout }) {
  const navClass = ({ isActive }) =>
    "flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm transition-colors " +
    (isActive
      ? "bg-[--color-bronze-500]/15 text-[--color-bronze-200] ring-1 ring-inset ring-[--color-bronze-500]/30"
      : "text-[--color-stone] hover:text-[--color-ivory] hover:bg-[--color-onyx-700]");

  // Inner content shared between desktop + mobile drawer
  const Inner = (
    <>
      <div className="flex items-center justify-between px-6 py-6 border-b border-[--color-onyx-700]">
        <Link to="/admin/dashboard" onClick={onClose}>
          <span className="font-display text-xl text-[--color-ivory]">Mercantix</span>
          <span className="block text-[10px] tracking-[0.3em] uppercase text-[--color-bronze-300] mt-0.5">
            Admin
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden grid place-items-center h-8 w-8 rounded-md text-[--color-stone] hover:text-[--color-ivory] hover:bg-[--color-onyx-700]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
        <p className="px-3 pb-2 pt-1 text-[10px] tracking-[0.3em] uppercase text-[--color-onyx-500]">
          Workspace
        </p>
        {ADMIN_NAV.map((n) => (
          <NavLink key={n.to} to={n.to} className={navClass} onClick={onClose}>
            <n.icon size={17} />
            {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[--color-onyx-700]">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-md text-sm text-[--color-stone] hover:text-[--color-ivory] hover:bg-[--color-onyx-700]"
        >
          <LogOut size={17} /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop — always visible */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-[--color-onyx-700] bg-[--color-onyx-800] sticky top-0 h-screen">
        {Inner}
      </aside>

      {/* Mobile — drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-[--color-onyx-900]/70 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 w-72 flex flex-col bg-[--color-onyx-800] border-r border-[--color-onyx-700] animate-fade-up">
            {Inner}
          </aside>
        </div>
      )}
    </>
  );
}
