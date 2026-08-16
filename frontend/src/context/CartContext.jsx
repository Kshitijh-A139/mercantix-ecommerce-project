import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { toast } from "sonner";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const STORAGE_KEY = "mercantix.cart";

const initialState = { items: [] };

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, qty = 1, size } = action;
      const key = `${product.id}::${size || ""}`;
      const exists = state.items.find((i) => i.key === key);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.key === key ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            key,
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: Number(product.price),
            image: product.image,
            size: size || null,
            qty,
          },
        ],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.key !== action.key) };
    case "QTY":
      return {
        items: state.items
          .map((i) => (i.key === action.key ? { ...i, qty: Math.max(0, action.qty) } : i))
          .filter((i) => i.qty > 0),
      };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return { items: action.items || [] };
    default:
      return state;
  }
}

// Backend cart row → flat local cart shape.
// Backend payload looks like { cartItemId, product: { productId, name, price, imageUrl, ... }, quantity, unitPrice }.
function fromApi(row) {
  const product = row.product || {};
  const id    = product.productId ?? row.productId ?? row.id;
  const name  = product.name      ?? row.name      ?? "Unknown product";
  const image = product.imageUrl  ?? row.imageUrl  ?? row.image;
  const price = Number(row.unitPrice ?? product.price ?? row.price ?? 0);
  return {
    key:   `${id}::`,
    id,
    name,
    brand: product.brand || row.brand || "",
    price,
    image,
    size:  null,
    qty:   Number(row.quantity ?? 1),
  };
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : initialState;
    } catch {
      return initialState;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── Persist local cart in localStorage (guest mode) ─────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // ── Hydrate from backend on login ───────────────────────────────
  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data    = await cartService.list();
      const rawRows = Array.isArray(data) ? data : (data.items || data.products || []);
      const items   = rawRows.map(fromApi).filter((i) => i.id != null);
      dispatch({ type: "HYDRATE", items });
    } catch (e) {
      setError(e.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { refresh(); }, [refresh]);

  // ── Mutations: optimistic locally + sync to backend if logged in ─
  const addToCart = useCallback(async (product, opts = {}) => {
    dispatch({ type: "ADD", product, ...opts });
    if (!isAuthenticated) return;
    try { await cartService.add(product.id, opts.qty || 1); }
    catch (e) { toast.error(e.message || "Could not add to cart"); refresh(); }
  }, [isAuthenticated, refresh]);

  const removeFromCart = useCallback(async (key) => {
    const item = state.items.find((i) => i.key === key);
    dispatch({ type: "REMOVE", key });
    if (!isAuthenticated || !item) return;
    try { await cartService.remove(item.id); }
    catch (e) { toast.error(e.message || "Could not remove item"); refresh(); }
  }, [isAuthenticated, state.items, refresh]);

  const updateQty = useCallback(async (key, qty) => {
    const item = state.items.find((i) => i.key === key);
    dispatch({ type: "QTY", key, qty });
    if (!isAuthenticated || !item) return;
    try { await cartService.update(item.id, qty); }
    catch (e) { toast.error(e.message || "Could not update quantity"); refresh(); }
  }, [isAuthenticated, state.items, refresh]);

  const clearCart = useCallback(async () => {
    dispatch({ type: "CLEAR" });
    if (!isAuthenticated) return;
    try { await cartService.clear(); }
    catch (e) { toast.error(e.message || "Could not clear cart"); refresh(); }
  }, [isAuthenticated, refresh]);

  const totals = useMemo(() => {
    const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal > 200 || subtotal === 0 ? 0 : 12;
    const tax = +(subtotal * 0.08).toFixed(2);
    return {
      subtotal,
      shipping,
      tax,
      total: +(subtotal + shipping + tax).toFixed(2),
      count: state.items.reduce((n, i) => n + i.qty, 0),
    };
  }, [state.items]);

  const value = {
    items: state.items,
    totals,
    loading,
    error,
    refresh,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
