import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Lock, ChevronLeft, CreditCard, Truck } from "lucide-react";
import { toast } from "sonner";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";

export default function Checkout() {
  const { items, totals, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: user?.email || "",
    firstName: user?.username || "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    country: "United States",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePlace = async (e) => {
    e.preventDefault();
    const required = ["email", "firstName", "lastName", "address", "city", "zip", "cardName", "cardNumber", "expiry", "cvv"];
    const missing = required.find((k) => !form[k]?.toString().trim());
    if (missing) {
      toast.error("Please complete all checkout fields.");
      return;
    }

    setPlacing(true);
    // Prices and total are computed server-side from the catalogue — we only
    // send productId + quantity (anything else would be ignored anyway).
    const result = await placeOrder({
      items: items.map((i) => ({
        productId: i.id,
        quantity:  i.qty,
      })),
      shippingAddress: {
        fullName:   `${form.firstName} ${form.lastName}`.trim(),
        email:      form.email,
        line1:      form.address,
        city:       form.city,
        postalCode: form.zip,
        country:    form.country,
      },
      paymentMethod: "CARD",
    });
    setPlacing(false);

    if (!result.ok) return;          // OrdersContext already toasted the error

    await clearCart();
    const id = result.order.id;
    toast.success("Order placed", { description: `Confirmation #${id}` });
    navigate(`/order-placed/${id}`);
  };

  return (
    <div className="container-luxe py-8 md:py-12">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase text-[--color-mist] hover:text-[--color-ink] mb-6">
        <ChevronLeft size={14} /> Back to bag
      </Link>

      <h1 className="font-display text-4xl md:text-5xl text-[--color-ink]">Checkout</h1>

      <form onSubmit={handlePlace} className="mt-10 grid lg:grid-cols-[1.5fr_1fr] gap-10">
        <div className="flex flex-col gap-12">
          {/* Contact */}
          <section className="flex flex-col gap-5">
            <Section number="01" title="Contact" icon={null} />
            <InputField label="Email" type="email" name="email" value={form.email} onChange={onChange} placeholder="you@email.com" required />
          </section>

          {/* Shipping */}
          <section className="flex flex-col gap-5">
            <Section number="02" title="Shipping address" icon={<Truck size={14} />} />
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField label="First name" name="firstName" value={form.firstName} onChange={onChange} required />
              <InputField label="Last name" name="lastName" value={form.lastName} onChange={onChange} required />
            </div>
            <InputField label="Street address" name="address" value={form.address} onChange={onChange} required />
            <div className="grid sm:grid-cols-[1.4fr_1fr_1fr] gap-5">
              <InputField label="City" name="city" value={form.city} onChange={onChange} required />
              <InputField label="ZIP" name="zip" value={form.zip} onChange={onChange} required />
              <InputField label="Country" name="country" value={form.country} onChange={onChange} required />
            </div>
          </section>

          {/* Payment */}
          <section className="flex flex-col gap-5">
            <Section number="03" title="Payment" icon={<CreditCard size={14} />} />
            <p className="text-[11px] text-[--color-mist] flex items-center gap-1.5">
              <Lock size={11} /> Demo only — no payment is taken.
            </p>
            <InputField label="Name on card" name="cardName" value={form.cardName} onChange={onChange} required />
            <InputField label="Card number" name="cardNumber" value={form.cardNumber} onChange={onChange} placeholder="1234 5678 9012 3456" required />
            <div className="grid grid-cols-2 gap-5">
              <InputField label="Expiry (MM/YY)" name="expiry" value={form.expiry} onChange={onChange} placeholder="04/29" required />
              <InputField label="CVV" name="cvv" value={form.cvv} onChange={onChange} placeholder="123" required />
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="bg-[--color-cream] rounded-sm p-6 md:p-8 h-fit lg:sticky lg:top-[88px]">
          <h2 className="font-display text-2xl text-[--color-ink]">Order summary</h2>
          <ul className="mt-5 flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-1">
            {items.map((it) => (
              <li key={it.key} className="flex gap-3">
                <div className="h-16 w-12 shrink-0 overflow-hidden bg-[--color-ivory] rounded-sm">
                  <img src={it.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm text-[--color-ink] leading-tight truncate">{it.name}</p>
                  <p className="text-[11px] text-[--color-mist] mt-0.5">
                    {it.size ? `${it.size} · ` : ""}Qty {it.qty}
                  </p>
                </div>
                <p className="text-sm text-[--color-ink]">${it.price * it.qty}</p>
              </li>
            ))}
          </ul>
          <div className="my-5 divider-rule" />
          <ul className="flex flex-col gap-2.5 text-sm">
            <Row label="Subtotal" value={`$${totals.subtotal.toFixed(2)}`} />
            <Row label="Shipping" value={totals.shipping === 0 ? "Complimentary" : `$${totals.shipping.toFixed(2)}`} />
            <Row label="Tax" value={`$${totals.tax.toFixed(2)}`} />
          </ul>
          <div className="my-5 divider-rule" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-[--color-ink]">Total</span>
            <span className="font-display text-2xl text-[--color-ink]">${totals.total.toFixed(2)}</span>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-6" disabled={placing}>
            {placing ? "Placing order…" : "Place Order"}
          </Button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-[--color-mist]">
            <Lock size={11} /> Secure SSL checkout
          </p>
        </aside>
      </form>
    </div>
  );
}

function Section({ number, title, icon }) {
  return (
    <div className="flex items-center gap-3 border-b border-[--color-sand]/70 pb-3">
      <span className="font-display text-2xl text-[--color-stone] tabular-nums">{number}</span>
      <h2 className="font-display text-xl text-[--color-ink] flex items-center gap-2">
        {icon} {title}
      </h2>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-[--color-mist]">{label}</span>
      <span className="text-[--color-ink]">{value}</span>
    </li>
  );
}
