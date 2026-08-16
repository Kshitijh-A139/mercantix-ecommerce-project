import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Filter, Search } from "lucide-react";
import Button from "../components/ui/Button";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import { useOrders } from "../context/OrdersContext";

const STATUS_TONE = {
  Processing: "bg-[--color-warning]/10 text-[--color-warning]",
  Shipped: "bg-[--color-bronze-600]/10 text-[--color-bronze-700]",
  Delivered: "bg-[--color-success]/10 text-[--color-success]",
  Cancelled: "bg-[--color-danger]/10 text-[--color-danger]",
};

export default function Orders() {
  const { orders } = useOrders();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = orders
    .filter((o) => (filter === "All" ? true : o.status === filter))
    .filter((o) =>
      query
        ? String(o.id).toLowerCase().includes(query.toLowerCase()) ||
          o.items.some((i) => i.name.toLowerCase().includes(query.toLowerCase()))
        : true
    );

  if (orders.length === 0) {
    return (
      <div className="container-luxe py-20 md:py-28 flex flex-col items-center text-center gap-5">
        <div className="h-20 w-20 grid place-items-center rounded-full bg-[--color-cream] text-[--color-mist]">
          <Package size={28} />
        </div>
        <div>
          <h1 className="font-display text-4xl text-[--color-ink]">No orders yet</h1>
          <p className="text-sm text-[--color-mist] mt-2">
            Your past orders will appear here.
          </p>
        </div>
        <Button as={Link} to="/products" variant="primary" size="lg">
          Start shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container-luxe py-8 md:py-12">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <span className="eyebrow">Account</span>
          <h1 className="font-display text-4xl md:text-5xl text-[--color-ink] mt-2">My Orders</h1>
        </div>
        <p className="text-sm text-[--color-mist]">{orders.length} total</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 pb-5 border-b border-[--color-sand]/70">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-mist]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders…"
            className="w-full bg-[--color-ivory] border border-[--color-sand] rounded-sm pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[--color-ink]"
          />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Filter size={13} className="text-[--color-mist] mr-1" />
          {["All", "Processing", "Shipped", "Delivered"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase rounded-full transition-colors ${
                filter === f
                  ? "bg-[--color-ink] text-[--color-ivory]"
                  : "text-[--color-mist] hover:text-[--color-ink]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <ul className="mt-8 flex flex-col gap-4">
        {filtered.length === 0 && (
          <li className="py-12 text-center text-sm text-[--color-mist]">
            No orders match your filters.
          </li>
        )}
        {filtered.map((o) => (
          <li
            key={o.id}
            className="border border-[--color-sand] rounded-md overflow-hidden bg-[--color-ivory] hover:shadow-[--shadow-card] transition-shadow"
          >
            <div className="px-5 md:px-6 py-4 flex items-center flex-wrap gap-4 border-b border-[--color-sand]/60 bg-[--color-cream]/60">
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[--color-mist]">Order</p>
                <p className="font-display text-lg text-[--color-ink]">{o.id}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[--color-mist]">Date</p>
                <p className="text-sm text-[--color-ink]">{o.date}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[--color-mist]">Total</p>
                <p className="text-sm text-[--color-ink]">${o.total.toFixed(2)}</p>
              </div>
              <span className={`ml-auto px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase rounded-sm ${STATUS_TONE[o.status]}`}>
                {o.status}
              </span>
            </div>

            <div className="px-5 md:px-6 py-4 flex items-center gap-4 flex-wrap">
              <div className="flex -space-x-3">
                {o.items.slice(0, 4).map((it, i) => (
                  <div key={i} className="h-12 w-10 overflow-hidden bg-[--color-cream] rounded-sm border-2 border-[--color-ivory]">
                    {it.image && (
                      <ImageWithFallback
                        src={it.image}
                        alt=""
                        wrapperClassName="h-full w-full"
                        className="h-full w-full object-cover"
                        sizes="40px"
                      />
                    )}
                  </div>
                ))}
                {o.items.length > 4 && (
                  <div className="h-12 w-10 grid place-items-center bg-[--color-cream] rounded-sm border-2 border-[--color-ivory] text-[10px] text-[--color-mist]">
                    +{o.items.length - 4}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[--color-ink] truncate">
                  {o.items.map((i) => i.name).join(", ")}
                </p>
                <p className="text-xs text-[--color-mist] mt-0.5">
                  {o.items.reduce((s, i) => s + i.qty, 0)} items
                </p>
              </div>
              <Link
                to={`/order-placed/${o.id}`}
                className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase text-[--color-ink] hover:text-[--color-bronze-700] border-b border-[--color-ink] pb-0.5"
              >
                View details <ChevronRight size={12} />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
