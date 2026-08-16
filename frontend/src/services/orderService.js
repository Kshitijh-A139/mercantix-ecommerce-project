// Orders + payment endpoints (requires JWT).
import api from "./api";

export const orderService = {
  // GET /api/orders → caller's orders (newest first)
  async myOrders()              { return (await api.get("/api/orders")).data; },

  // GET /api/orders/:id → single order
  async getById(orderId)        { return (await api.get(`/api/orders/${orderId}`)).data; },

  // POST /api/orders → place an order from current cart
  async placeOrder(payload)     { return (await api.post("/api/orders", payload)).data; },

  // POST /api/payments → create payment intent (Razorpay/etc.)
  async createPayment(payload)  { return (await api.post("/api/payments", payload)).data; },

  // POST /api/payments/verify → verify provider callback
  async verifyPayment(payload)  { return (await api.post("/api/payments/verify", payload)).data; },
};
