import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Badge from "./ui/Badge";
import ImageWithFallback from "./ui/ImageWithFallback";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addToCart(product, { qty: 1 });
    toast.success("Added to bag", {
      description: `${product.name} · $${product.price}`,
    });
  };

  return (
    <article className="group flex flex-col gap-3">
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-[3/4] overflow-hidden bg-[--color-cream] rounded-sm"
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          wrapperClassName="absolute inset-0"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {product.tag && (
          <div className="absolute top-3 left-3 z-10">
            <Badge tone={product.tag === "Best Seller" ? "dark" : "bronze"}>
              {product.tag}
            </Badge>
          </div>
        )}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-[--color-ivory]/95 text-[--color-ink] shadow-[--shadow-soft] opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[--color-ink] hover:text-[--color-ivory]"
          aria-label={`Add ${product.name} to bag`}
        >
          <ShoppingBag size={16} />
        </button>
      </Link>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[--color-mist]">
          {product.brand}
        </span>
        <Link
          to={`/products/${product.id}`}
          className="font-display text-[17px] leading-snug text-[--color-ink] hover:text-[--color-bronze-700]"
        >
          {product.name}
        </Link>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] text-[--color-ink]">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-[--color-stone] line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1 text-[--color-mist]">
              <Star size={12} className="fill-[--color-warning] stroke-[--color-warning]" />
              <span className="text-xs">{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
