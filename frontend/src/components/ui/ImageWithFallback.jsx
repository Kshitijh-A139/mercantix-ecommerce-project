import { useEffect, useRef, useState } from "react";

/**
 * Production-grade product image:
 *   - native lazy-loading + async decoding (no blocking on the main thread)
 *   - blur-up placeholder: a low-res Unsplash variant is rendered first, then
 *     the full image fades in over it
 *   - srcset with 400 / 800 / 1200 widths so retina + small screens get the
 *     right pixel density without paying for it on mobile
 *   - fade-in transition gated on load, broken-image fallback gated on error
 *
 * Usage: drop-in replacement for <img>. Spread-friendly.
 */
export default function ImageWithFallback({
  src,
  alt = "",
  className = "",
  wrapperClassName = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  eager = false,                 // pass true for above-the-fold hero images
  ...rest
}) {
  const [loaded, setLoaded]   = useState(false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef(null);

  // If the cached image is already complete by mount (back-button nav), fade in immediately.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, [src]);

  const isUnsplash = typeof src === "string" && src.includes("images.unsplash.com");
  const baseSrc    = isUnsplash ? stripParams(src) : src;
  const tiny       = isUnsplash ? `${baseSrc}?w=24&q=20&blur=50&auto=format`  : null;
  const srcSet     = isUnsplash
    ? `${baseSrc}?w=400&q=75&auto=format 400w, ${baseSrc}?w=800&q=80&auto=format 800w, ${baseSrc}?w=1200&q=80&auto=format 1200w`
    : undefined;
  const displaySrc = isUnsplash ? `${baseSrc}?w=800&q=80&auto=format` : src;

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Blur-up placeholder */}
      {tiny && !errored && (
        <img
          src={tiny}
          alt=""
          aria-hidden="true"
          className={`${className} absolute inset-0 h-full w-full object-cover blur-xl scale-110 transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
        />
      )}
      {/* Skeleton — only if we can't blur-up */}
      {!tiny && !loaded && !errored && (
        <div className="skeleton absolute inset-0" aria-hidden="true" />
      )}

      {errored ? (
        <div
          className="absolute inset-0 grid place-items-center bg-[--color-cream] text-[--color-stone]"
          aria-label="Image unavailable"
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.6" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={displaySrc}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={eager ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`${className} relative transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          {...rest}
        />
      )}
    </div>
  );
}

// Drop the existing ?w=... query so we can rebuild a srcset cleanly.
function stripParams(url) {
  const q = url.indexOf("?");
  return q === -1 ? url : url.slice(0, q);
}
