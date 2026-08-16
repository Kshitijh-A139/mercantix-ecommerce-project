import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { orderService } from "../services/orderService";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext(null);

// Backend Order entity → flat shape the Orders / OrderPlaced pages expect.
function fromApi(o) {
  if (!o) return null;

  // Try to recover a structured shipping object from the persisted JSON string.
  let shipping = null;
  if (o.shippingAddress) {
    if (typeof o.shippingAddress === "string") {
      try { shipping = JSON.parse(o.shippingAddress); }
      catch { shipping = { line1: o.shippingAddress }; }
    } else if (typeof o.shippingAddress === "object") {
      shipping = o.shippingAddress;
    }
  }

  const items = (o.items || []).map((it) => ({
    id:    it.productId ?? it.id,
    name:  it.productName ?? it.name,
    qty:   it.quantity ?? it.qty ?? 1,
    price: Number(it.price ?? it.unitPrice ?? 0),
    image: it.productImage || it.image || null,
  }));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total    = Number(o.total ?? subtotal);

  return {
    id:     o.orderId ?? o.id,
    date:   (o.placedAt || o.createdAt || new Date().toISOString()).slice(0, 10),
    status: friendlyStatus(o.status),
    total,
    items,
    shipping,
    breakdown: {
      subtotal,
      shipping: Number(o.shippingFee ?? 0),
      tax:      Number(o.tax ?? 0),
    },
  };
}

function friendlyStatus(s) {
  if (!s) return "Processing";
  const u = String(s).toUpperCase();
  if (u === "PENDING" || u === "CONFIRMED") return "Processing";
  if (u === "SHIPPED")   return "Shipped";
  if (u === "DELIVERED") return "Delivered";
  if (u === "CANCELLED" || u === "REFUNDED") return "Cancelled";
  return s;
}

export function OrdersProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) { setOrders([]); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.myOrders();
      const rows = Array.isArray(data) ? data : (data.orders || []);
      setOrders(rows.map(fromApi).filter(Boolean));
    } catch (e) {
      setError(e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { refresh(); }, [refresh]);

  const placeOrder = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const raw   = await orderService.placeOrder(payload);
      const order = fromApi(raw);
      if (!order) throw new Error("Order created but server did not return order details.");
      setOrders((prev) => [order, ...prev]);
      return { ok: true, order };
    } catch (e) {
      const msg = e.message || "Could not place order";
      setError(msg);
      toast.error(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrder = useCallback(
    (id) => orders.find((o) => String(o.id) === String(id)),
    [orders]
  );

  return (
    <OrdersContext.Provider value={{ orders, loading, error, refresh, placeOrder, getOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrdersProvider>");
  return ctx;
};
