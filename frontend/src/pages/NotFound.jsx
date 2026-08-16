import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-luxe py-28 md:py-40 text-center">
      <p className="eyebrow !text-[--color-mist]">Error 404</p>
      <h1 className="font-display text-5xl md:text-7xl text-[--color-ink] mt-3">
        Page not found
      </h1>
      <p className="text-sm text-[--color-mist] mt-4 max-w-md mx-auto">
        The page you’re looking for doesn’t exist or has moved. Let’s get you back
        to the collection.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/home"
          className="inline-flex items-center justify-center px-7 py-3.5 text-sm tracking-[0.08em] uppercase rounded-[--radius-xs] bg-[--color-ink] text-[--color-ivory] hover:bg-[--color-bronze-700] transition-colors"
        >
          Back to home
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center justify-center px-7 py-3.5 text-sm tracking-[0.08em] uppercase rounded-[--radius-xs] border border-[--color-ink] text-[--color-ink] hover:bg-[--color-ink] hover:text-[--color-ivory] transition-colors"
        >
          Shop all
        </Link>
      </div>
    </div>
  );
}
