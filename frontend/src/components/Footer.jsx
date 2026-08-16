import { Link } from "react-router-dom";

const Social = {
  Instagram: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  Twitter: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.594l-5.165-6.75L5.3 22H2.044l8.025-9.17L1 2h6.78l4.668 6.17L18.244 2Zm-2.31 18h1.83L7.16 4H5.2l10.733 16Z" />
    </svg>
  ),
  Facebook: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
      <path d="M22 12.07C22 6.49 17.52 2 11.94 2S2 6.49 2 12.07c0 5 3.66 9.15 8.44 9.93v-7.02H7.9v-2.91h2.54V9.84c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.45 2.91h-2.33V22c4.78-.78 8.43-4.93 8.43-9.93Z" />
    </svg>
  ),
  Youtube: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.13-2.14C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.37.46A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.02 3.02 0 0 0 2.13 2.14C4.5 20.4 12 20.4 12 20.4s7.5 0 9.37-.46a3.02 3.02 0 0 0 2.13-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8ZM9.6 15.6V8.4l6.24 3.6L9.6 15.6Z" />
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer className="mt-24 bg-[--color-cream] border-t border-[--color-sand]/70">
      <div className="container-luxe py-16 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="font-display text-2xl text-[--color-ink]">
            Mercantix
          </Link>
          <p className="mt-3 text-sm text-[--color-mist] max-w-xs">
            Elevated essentials, considered design. A modern marketplace for the
            timeless wardrobe.
          </p>
          <div className="mt-5 flex gap-3 text-[--color-mist]">
            <a className="hover:text-[--color-bronze-700]" href="#" aria-label="Instagram"><Social.Instagram /></a>
            <a className="hover:text-[--color-bronze-700]" href="#" aria-label="Twitter"><Social.Twitter /></a>
            <a className="hover:text-[--color-bronze-700]" href="#" aria-label="Facebook"><Social.Facebook /></a>
            <a className="hover:text-[--color-bronze-700]" href="#" aria-label="Youtube"><Social.Youtube /></a>
          </div>
        </div>

        <FooterCol title="Shop">
          <FooterLink to="/products?cat=men">Men</FooterLink>
          <FooterLink to="/products?cat=women">Women</FooterLink>
          <FooterLink to="/products?cat=accessories">Accessories</FooterLink>
          <FooterLink to="/products?cat=sale">Sale</FooterLink>
        </FooterCol>

        <FooterCol title="Help">
          <FooterLink to="#">Contact</FooterLink>
          <FooterLink to="#">Shipping & Returns</FooterLink>
          <FooterLink to="#">Size Guide</FooterLink>
          <FooterLink to="/orders">Track Order</FooterLink>
        </FooterCol>

        <FooterCol title="Company">
          <FooterLink to="#">Our Story</FooterLink>
          <FooterLink to="#">Journal</FooterLink>
          <FooterLink to="#">Sustainability</FooterLink>
          <FooterLink to="#">Press</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-[--color-sand]/80">
        <div className="container-luxe py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[--color-mist]">
          <span>© {new Date().getFullYear()} Mercantix. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[--color-ink]">Privacy</a>
            <a href="#" className="hover:text-[--color-ink]">Terms</a>
            <a href="#" className="hover:text-[--color-ink]">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.22em] uppercase text-[--color-ink] font-medium">
        {title}
      </p>
      <ul className="mt-4 flex flex-col gap-2.5 text-sm text-[--color-mist]">
        {children}
      </ul>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="hover:text-[--color-ink]">
        {children}
      </Link>
    </li>
  );
}
