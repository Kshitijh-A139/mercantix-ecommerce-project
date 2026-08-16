import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Lock } from "lucide-react";
import { toast } from "sonner";
import Button from "../components/ui/Button";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, totals, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container-luxe py-20 md:py-28 flex flex-col items-center text-center gap-5">
        <div className="h-20 w-20 grid place-items-center rounded-full bg-[--color-cream] text-[--color-mist]">
          <ShoppingBag size={28} />
        </div>
        <div>
          <h1 className="font-display text-4xl text-[--color-ink]">Your bag is empty</h1>
          <p className="text-sm text-[--color-mist] mt-2">
            Discover our latest arrivals and considered essentials.
          </p>
        </div>
        <Button as={Link} to="/products" variant="primary" size="lg">
          Continue shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container-luxe py-8 md:py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="eyebrow">Shopping Bag</span>
          <h1 className="font-display text-4xl md:text-5xl text-[--color-ink] mt-2">
            Your Bag
          </h1>
        </div>
        <p className="text-sm text-[--color-mist]">{totals.count} {totals.count === 1 ? "item" : "items"}</p>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">
        {/* Items */}
        <ul className="flex flex-col">
          {items.map((it, idx) => (
            <li
              key={it.key}
              className={`grid grid-cols-[100px_1fr_auto] md:grid-cols-[120px_1fr_auto] gap-5 py-6 ${
                idx > 0 ? "border-t border-[--color-sand]/70" : ""
              }`}
            >
              <Link to={`/products/${it.id}`} className="block">
                <ImageWithFallback
                  src={it.image}
                  alt={it.name}
                  wrapperClassName="aspect-[3/4] bg-[--color-cream] rounded-sm"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </Link>

              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[--color-mist]">{it.brand}</span>
                <Link to={`/products/${it.id}`} className="font-display text-lg text-[--color-ink] hover:text-[--color-bronze-700] leading-snug">
                  {it.name}
                </Link>
                {it.size && (
                  <p className="text-xs text-[--color-mist] mt-1">Size: <span className="text-[--color-ink-soft]">{it.size}</span></p>
                )}

                <div className="mt-auto pt-3 flex items-center gap-4">
                  <div className="inline-flex items-center border border-[--color-sand]">
                    <button
                      onClick={() => updateQty(it.key, it.qty - 1)}
                      className="h-9 w-9 grid place-items-center hover:bg-[--color-cream]"
                      aria-label="Decrease"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm">{it.qty}</span>
                    <button
                      onClick={() => updateQty(it.key, it.qty + 1)}
                      className="h-9 w-9 grid place-items-center hover:bg-[--color-cream]"
                      aria-label="Increase"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(it.key);
                      toast("Removed from bag", { description: it.name });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-[--color-mist] hover:text-[--color-danger]"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-display text-lg text-[--color-ink]">${it.price * it.qty}</p>
                {it.qty > 1 && (
                  <p className="text-[11px] text-[--color-mist] mt-1">${it.price} each</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="bg-[--color-cream] rounded-sm p-6 md:p-8 h-fit lg:sticky lg:top-[88px]">
          <h2 className="font-display text-2xl text-[--color-ink]">Order Summary</h2>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            <Row label="Subtotal" value={`$${totals.subtotal.toFixed(2)}`} />
            <Row
              label="Shipping"
              value={totals.shipping === 0 ? "Complimentary" : `$${totals.shipping.toFixed(2)}`}
              valueClass={totals.shipping === 0 ? "text-[--color-bronze-700]" : ""}
            />
            <Row label="Estimated Tax" value={`$${totals.tax.toFixed(2)}`} />
          </ul>
          <div className="my-5 divider-rule" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-[--color-ink]">Total</span>
            <span className="font-display text-2xl text-[--color-ink]">${totals.total.toFixed(2)}</span>
          </div>

          {totals.subtotal < 200 && (
            <p className="text-[11px] text-[--color-mist] mt-3">
              Add ${(200 - totals.subtotal).toFixed(2)} more for complimentary shipping.
            </p>
          )}

          <Button onClick={() => navigate("/checkout")} variant="primary" size="lg" className="w-full mt-6">
            Checkout <ArrowRight size={16} />
          </Button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-[--color-mist]">
            <Lock size={11} /> Secure SSL checkout
          </p>

          <Link to="/products" className="mt-5 block text-center text-xs text-[--color-ink] hover:text-[--color-bronze-700] underline underline-offset-4">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = "" }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-[--color-mist]">{label}</span>
      <span className={`text-[--color-ink] ${valueClass}`}>{value}</span>
    </li>
  );
}
