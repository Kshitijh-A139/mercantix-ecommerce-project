import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, ChevronLeft, Star, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import Button from "../components/ui/Button";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let active = true;
    setSelectedSize(null);
    setQty(1);
    setActiveImg(0);
    setLoading(true);
    setNotFound(false);

    productService
      .getById(id)
      .then((p) => {
        if (!active) return;
        setProduct(p);
        // Load a few related items from the same category.
        return productService
          .list({ category: p.category, size: 8 })
          .then((res) => {
            if (active) setRelated(res.items.filter((r) => r.id !== p.id).slice(0, 4));
          })
          .catch(() => {});
      })
      .catch((e) => {
        if (active) {
          if (e.status === 404) setNotFound(true);
          else setNotFound(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container-luxe py-8 md:py-12">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16">
          <div className="aspect-[4/5] bg-[--color-cream] rounded-sm animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-4 w-24 bg-[--color-cream] rounded animate-pulse" />
            <div className="h-9 w-2/3 bg-[--color-cream] rounded animate-pulse" />
            <div className="h-6 w-28 bg-[--color-cream] rounded animate-pulse" />
            <div className="h-24 w-full bg-[--color-cream] rounded animate-pulse" />
            <div className="h-12 w-full bg-[--color-cream] rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container-luxe py-32 text-center">
        <h1 className="font-display text-4xl text-[--color-ink]">Product not found</h1>
        <Link to="/products" className="mt-4 inline-block text-sm text-[--color-bronze-700] underline">
          Back to all products
        </Link>
      </div>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : [product.image];

  const handleAdd = () => {
    if (product.sizes?.length > 1 && !selectedSize) {
      toast.error("Please select a size first.");
      return;
    }
    addToCart(product, { qty, size: selectedSize || product.sizes?.[0] });
    toast.success("Added to bag", { description: `${product.name} · $${product.price * qty}` });
  };

  const handleBuyNow = () => {
    if (product.sizes?.length > 1 && !selectedSize) {
      toast.error("Please select a size first.");
      return;
    }
    addToCart(product, { qty, size: selectedSize || product.sizes?.[0] });
    navigate("/checkout");
  };

  return (
    <div className="container-luxe py-8 md:py-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase text-[--color-mist] hover:text-[--color-ink] mb-6"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="grid grid-cols-[64px_1fr] gap-3 sm:gap-4">
          <div className="flex flex-col gap-2.5">
            {gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-square overflow-hidden rounded-sm border transition-colors ${
                  activeImg === i ? "border-[--color-ink]" : "border-[--color-sand] hover:border-[--color-mist]"
                }`}
                aria-label={`Thumbnail ${i + 1}`}
              >
                <img src={g} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <ImageWithFallback
            src={gallery[activeImg]}
            alt={product.name}
            wrapperClassName="aspect-[4/5] bg-[--color-cream] rounded-sm"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="text-[11px] tracking-[0.2em] uppercase text-[--color-mist]">{product.brand}</span>
            <h1 className="font-display text-3xl md:text-4xl text-[--color-ink] mt-1">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-[--color-warning] stroke-[--color-warning]" />
                <span className="text-sm text-[--color-ink]">{product.rating}</span>
                <span className="text-xs text-[--color-mist]">({product.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl text-[--color-ink]">${product.price}</span>
            {product.originalPrice && (
              <span className="text-base text-[--color-stone] line-through">${product.originalPrice}</span>
            )}
          </div>

          <p className="text-sm text-[--color-ink-soft] leading-relaxed border-t border-[--color-sand]/70 pt-5">
            {product.description}
          </p>

          {product.sizes?.length > 1 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="eyebrow !text-[--color-mist]">Select Size</p>
                <button className="text-[11px] tracking-[0.18em] uppercase text-[--color-mist] hover:text-[--color-ink]">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[48px] h-11 px-3 text-sm border transition-colors ${
                      selectedSize === s
                        ? "border-[--color-ink] bg-[--color-ink] text-[--color-ivory]"
                        : "border-[--color-sand] hover:border-[--color-ink]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="flex items-center gap-4">
            <p className="eyebrow !text-[--color-mist]">Qty</p>
            <div className="inline-flex items-center border border-[--color-sand]">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-10 grid place-items-center hover:bg-[--color-cream]"
                aria-label="Decrease"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="h-10 w-10 grid place-items-center hover:bg-[--color-cream]"
                aria-label="Increase"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <Button onClick={handleAdd} variant="primary" size="lg" className="flex-1">
              <ShoppingBag size={16} /> Add to Bag
            </Button>
            <Button onClick={handleBuyNow} variant="bronze" size="lg" className="flex-1">
              Buy Now
            </Button>
            <button
              onClick={() => toast("Saved to wishlist")}
              className="inline-flex h-[50px] w-[50px] items-center justify-center border border-[--color-ink] hover:bg-[--color-cream]"
              aria-label="Save to wishlist"
            >
              <Heart size={18} />
            </button>
          </div>

          {/* Trust */}
          <ul className="border-t border-[--color-sand]/70 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <TrustRow icon={<Truck size={14} />} label="Free shipping over $200" />
            <TrustRow icon={<RotateCcw size={14} />} label="30-day easy returns" />
            <TrustRow icon={<ShieldCheck size={14} />} label="Secure checkout" />
          </ul>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl md:text-3xl text-[--color-ink] mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function TrustRow({ icon, label }) {
  return (
    <li className="flex items-center gap-2 text-[--color-mist]">
      <span className="text-[--color-bronze-700]">{icon}</span>
      {label}
    </li>
  );
}
