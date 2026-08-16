import { Link, useParams, Navigate } from "react-router-dom";
import { Check, Package, Truck, Home as HomeIcon } from "lucide-react";
import Button from "../components/ui/Button";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import { useOrders } from "../context/OrdersContext";

export default function OrderPlaced() {
  const { id } = useParams();
  const { getOrder } = useOrders();
  const order = getOrder(id);

  if (!order) return <Navigate to="/orders" replace />;

  return (
    <div className="container-luxe py-12 md:py-20 max-w-3xl">
      <div className="flex flex-col items-center text-center">
        <div className="h-16 w-16 grid place-items-center rounded-full bg-[--color-bronze-600] text-[--color-ivory] mb-5 animate-fade-up">
          <Check size={28} strokeWidth={2.4} />
        </div>
        <span className="eyebrow">Order confirmed</span>
        <h1 className="font-display text-4xl md:text-5xl text-[--color-ink] mt-3">
          Thank you{order.shipping?.fullName ? `, ${order.shipping.fullName.split(" ")[0]}` : ""}.
        </h1>
        <p className="text-[--color-mist] mt-3 max-w-md">
          Your order has been placed and is being prepared. A confirmation has been sent to your email.
        </p>
      </div>

      {/* Receipt card */}
      <div className="mt-10 border border-[--color-sand] rounded-md bg-[--color-ivory] overflow-hidden">
        <div className="px-6 md:px-8 py-5 flex flex-wrap items-baseline justify-between gap-3 bg-[--color-cream]">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[--color-mist]">Order #</p>
            <p className="font-display text-xl text-[--color-ink]">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-[0.22em] uppercase text-[--color-mist]">Placed</p>
            <p className="text-sm text-[--color-ink]">{order.date}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-6 md:px-8 py-6 border-b border-[--color-sand]/70">
          <div className="flex items-center justify-between">
            <Step icon={<Check size={14} />} label="Confirmed" done />
            <Track />
            <Step icon={<Package size={14} />} label="Processing" done />
            <Track />
            <Step icon={<Truck size={14} />} label="Shipped" />
            <Track />
            <Step icon={<HomeIcon size={14} />} label="Delivered" />
          </div>
        </div>

        {/* Items */}
        <ul className="px-6 md:px-8 py-5 divide-y divide-[--color-sand]/60">
          {order.items.map((it) => (
            <li key={`${it.id}-${it.size || ""}`} className="py-4 flex gap-4">
              <div className="h-20 w-16 overflow-hidden bg-[--color-cream] rounded-sm shrink-0">
                {it.image && (
                  <ImageWithFallback
                    src={it.image}
                    alt=""
                    wrapperClassName="h-full w-full"
                    className="h-full w-full object-cover"
                    sizes="64px"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-[15px] text-[--color-ink] truncate">{it.name}</p>
                <p className="text-xs text-[--color-mist] mt-0.5">
                  {it.size ? `${it.size} · ` : ""}Qty {it.qty}
                </p>
              </div>
              <p className="text-sm text-[--color-ink]">${it.price * it.qty}</p>
            </li>
          ))}
        </ul>

        {/* Totals */}
        <div className="px-6 md:px-8 py-5 bg-[--color-cream] grid sm:grid-cols-2 gap-6">
          <div>
            <p className="eyebrow !text-[--color-mist] mb-2">Shipping to</p>
            <p className="text-sm text-[--color-ink]">{order.shipping?.fullName}</p>
            <p className="text-xs text-[--color-mist] leading-relaxed">
              {order.shipping?.line1}
              {order.shipping?.line2 ? <><br />{order.shipping.line2}</> : null}
              <br />
              {order.shipping?.city} {order.shipping?.postalCode}, {order.shipping?.country}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Row label="Subtotal" value={`$${order.breakdown?.subtotal?.toFixed(2)}`} />
            <Row label="Shipping" value={order.breakdown?.shipping === 0 ? "Complimentary" : `$${order.breakdown?.shipping?.toFixed(2)}`} />
            <Row label="Tax" value={`$${order.breakdown?.tax?.toFixed(2)}`} />
            <div className="divider-rule my-1" />
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[--color-ink]">Total</span>
              <span className="font-display text-xl text-[--color-ink]">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button as={Link} to="/orders" variant="primary" size="lg">
          View My Orders
        </Button>
        <Button as={Link} to="/products" variant="outline" size="lg">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

function Step({ icon, label, done }) {
  return (
    <div className="flex flex-col items-center gap-1.5 z-10">
      <div className={`h-8 w-8 grid place-items-center rounded-full border ${
        done ? "bg-[--color-bronze-600] border-[--color-bronze-600] text-[--color-ivory]" : "bg-[--color-ivory] border-[--color-sand] text-[--color-stone]"
      }`}>
        {icon}
      </div>
      <span className={`text-[10px] tracking-[0.16em] uppercase ${done ? "text-[--color-ink]" : "text-[--color-mist]"}`}>{label}</span>
    </div>
  );
}

function Track() {
  return <div className="flex-1 h-px bg-[--color-sand] mx-2" />;
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-[--color-mist]">{label}</span>
      <span className="text-[--color-ink]">{value}</span>
    </div>
  );
}
