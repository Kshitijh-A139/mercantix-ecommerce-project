import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search, ShoppingBag, LogOut, Package, MapPin, ChevronDown, Menu, User as UserIcon, Heart, Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { categories } from "../data/categories";
import SearchOverlay from "./SearchOverlay";
import MobileMenu from "./MobileMenu";

const ACCOUNT_ICON =
  "data:image/png;base64,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";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totals } = useCart();
  const navigate = useNavigate();

  const [openCategory, setOpenCategory] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setProfileOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Glass backdrop — dims & blurs page content when a menu is open.
          pointer-events-none so it never intercepts clicks on page content;
          the profile menu closes via the outside-click listener and the
          category menu closes on mouse-leave. */}
      {(profileOpen || openCategory) && (
        <div
          className="fixed inset-0 z-30 bg-[--color-ink]/25 backdrop-blur-sm animate-fade-up pointer-events-none"
          aria-hidden="true"
        />
      )}

      <header
        className={`sticky top-0 z-40 backdrop-blur-xl transition-[background-color,box-shadow] ${
          scrolled
            ? "bg-ivory/97 shadow-[0_8px_24px_rgba(11,15,14,0.08)] border-b border-sand"
            : "bg-ivory/90 border-b border-sand/60"
        }`}
      >
        <div className="container-luxe grid grid-cols-[1fr_auto_1fr] items-center h-[68px] gap-4">
          {/* LEFT */}
          <div className="flex items-center">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden grid h-9 w-9 place-items-center rounded-full hover:bg-[--color-cream] text-[--color-ink] -ml-1.5"
            >
              <Menu size={20} />
            </button>

            <nav
              className="hidden md:flex items-center gap-7"
              onMouseLeave={() => setOpenCategory(null)}
            >
              {categories.map((c) => (
                <div key={c.id} onMouseEnter={() => setOpenCategory(c.id)}>
                  <NavLink
                    to={`/products?cat=${c.id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-1 text-[12px] tracking-[0.18em] uppercase transition-colors ${
                        isActive ? "text-[--color-bronze-700]" : "text-[--color-ink] hover:text-[--color-bronze-700]"
                      }`
                    }
                  >
                    {c.label}
                    {c.sub?.length > 0 && <ChevronDown size={12} className="opacity-60" />}
                  </NavLink>
                </div>
              ))}
            </nav>
          </div>

          {/* CENTER — brand */}
          <Link
            to={isAuthenticated ? "/home" : "/"}
            className="font-display text-2xl tracking-tight text-[--color-ink] whitespace-nowrap"
          >
            Mercantix
          </Link>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-[--color-cream] text-[--color-ink]"
            >
              <Search size={18} />
            </button>

            <Link
              to="/cart"
              aria-label={`Cart, ${totals.count} items`}
              className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-[--color-cream] text-[--color-ink]"
            >
              <ShoppingBag size={18} />
              {totals.count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid place-items-center h-[18px] min-w-[18px] px-1 bg-[--color-ink] text-[--color-ivory] text-[10px] font-medium rounded-full">
                  {totals.count}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative ml-1" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-label="Account menu"
                  aria-expanded={profileOpen}
                  className="grid h-9 w-9 place-items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-bronze-400] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-ivory] transition-transform hover:scale-[1.04]"
                >
                  <img
                    src={ACCOUNT_ICON}
                    alt="Account"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[52px] w-[280px] bg-[--color-ivory] border border-[--color-sand] rounded-md shadow-[0_20px_60px_rgba(11,15,14,0.14),0_2px_8px_rgba(11,15,14,0.06)] overflow-hidden animate-fade-up"
                  >
                    {/* Identity */}
                    <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                      <img
                        src={ACCOUNT_ICON}
                        alt="Account"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-display text-[16px] leading-tight text-[--color-ink] truncate">
                          {user?.username}
                        </p>
                        <p className="text-[11px] text-[--color-mist] truncate">{user?.email}</p>
                      </div>
                    </div>

                    <div className="divider-rule" />

                    {/* Primary actions */}
                    <ul className="py-1.5">
                      <DropdownItem to="/account" icon={<UserIcon size={15} />} onClick={() => setProfileOpen(false)}>
                        My Account
                      </DropdownItem>
                      <DropdownItem to="/orders" icon={<Package size={15} />} onClick={() => setProfileOpen(false)}>
                        My Orders
                      </DropdownItem>
                      <DropdownItem to="/account/wishlist" icon={<Heart size={15} />} onClick={() => setProfileOpen(false)}>
                        Wishlist
                      </DropdownItem>
                      <DropdownItem to="/account/addresses" icon={<MapPin size={15} />} onClick={() => setProfileOpen(false)}>
                        Address Book
                      </DropdownItem>
                      <DropdownItem to="/account/settings" icon={<Settings size={15} />} onClick={() => setProfileOpen(false)}>
                        Settings
                      </DropdownItem>
                    </ul>

                    <div className="divider-rule" />

                    {/* Destructive */}
                    <ul className="py-1.5">
                      <li role="none">
                        <button
                          role="menuitem"
                          onClick={handleLogout}
                          className="group flex w-full items-center gap-3 px-5 py-2.5 text-sm text-[--color-ink] hover:bg-[--color-cream] transition-colors"
                        >
                          <LogOut size={15} className="text-[--color-mist] group-hover:text-[--color-danger] transition-colors" />
                          <span className="group-hover:text-[--color-danger] transition-colors">Log Out</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center text-[12px] tracking-[0.18em] uppercase text-[--color-ink] hover:text-[--color-bronze-700] ml-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Category mega-dropdown */}
        {openCategory && (
          <CategoryMega
            category={categories.find((c) => c.id === openCategory)}
            onLeave={() => setOpenCategory(null)}
          />
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function DropdownItem({ to, icon, children, onClick }) {
  return (
    <li role="none">
      <Link
        role="menuitem"
        to={to}
        onClick={onClick}
        className="group flex items-center gap-3 px-5 py-2.5 text-sm text-[--color-ink] hover:bg-[--color-cream] transition-colors"
      >
        <span className="text-[--color-mist] group-hover:text-[--color-bronze-700] transition-colors">
          {icon}
        </span>
        <span className="group-hover:text-[--color-bronze-700] transition-colors">{children}</span>
      </Link>
    </li>
  );
}

function CategoryMega({ category, onLeave }) {
  if (!category?.sub?.length) return null;
  return (
    <div
      onMouseLeave={onLeave}
      className="absolute left-0 right-0 top-full z-40 bg-[--color-ivory] border-t border-[--color-sand]/70 shadow-[--shadow-lift]"
    >
      <div className="container-luxe py-8 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10">
        <div>
          <p className="eyebrow mb-4">{category.blurb}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2.5">
            {category.sub.map((s) => (
              <Link
                key={s.id}
                to={`/products?cat=${category.id}&sub=${s.id}`}
                className="text-[14px] text-[--color-ink-soft] hover:text-[--color-bronze-700]"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
        <Link
          to={`/products?cat=${category.id}`}
          className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-[--color-cream]"
        >
          <img
            src={category.image}
            alt={category.label}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-4 left-4 text-[--color-ivory] font-display text-xl">
            Shop {category.label} →
          </span>
        </Link>
      </div>
    </div>
  );
}
