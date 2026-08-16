// Admin endpoint wrappers. Each method mirrors a backend route under /api/admin/*
// and falls back to mock data so the UI can be built independently of the API.
import api from "../../services/api";
import { mockProducts, mockUsers, mockOrders, monthlySales, categoryShare, topSellers } from "../data/mockData";

const USE_MOCKS = import.meta.env.VITE_ADMIN_MOCKS !== "false";
const sleep = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const adminService = {
  // ── Dashboard / analytics ──────────────────────────────────────
  async dashboard() {
    if (USE_MOCKS) { await sleep(); return { monthlySales, categoryShare, topSellers }; }
    return (await api.get("/api/admin/dashboard")).data;
  },

  async salesOverview({ range = "year" } = {}) {
    if (USE_MOCKS) { await sleep(); return { monthlySales, categoryShare }; }
    return (await api.get("/api/admin/sales", { params: { range } })).data;
  },

  // ── Products ───────────────────────────────────────────────────
  async listProducts() {
    if (USE_MOCKS) { await sleep(); return mockProducts; }
    return (await api.get("/api/products", { params: { size: 200 } })).data;
  },

  async getProduct(id) {
    if (USE_MOCKS) { await sleep(); return mockProducts.find((p) => p.id === Number(id)); }
    return (await api.get(`/api/products/${id}`)).data;
  },

  async createProduct(payload) {
    if (USE_MOCKS) { await sleep(); return { id: Date.now(), ...payload }; }
    return (await api.post("/api/admin/products", payload)).data;
  },

  async updateProduct(id, payload) {
    if (USE_MOCKS) { await sleep(); return { id, ...payload }; }
    return (await api.put(`/api/admin/products/${id}`, payload)).data;
  },

  async deleteProduct(id) {
    if (USE_MOCKS) { await sleep(); return { id }; }
    return (await api.delete(`/api/admin/products/${id}`)).data;
  },

  // ── Users ──────────────────────────────────────────────────────
  async listUsers() {
    if (USE_MOCKS) { await sleep(); return mockUsers; }
    return (await api.get("/api/admin/users")).data;
  },

  async updateUser(id, payload) {
    if (USE_MOCKS) { await sleep(); return { id, ...payload }; }
    return (await api.put(`/api/admin/users/${id}`, payload)).data;
  },

  // ── Orders ─────────────────────────────────────────────────────
  async listOrders() {
    if (USE_MOCKS) { await sleep(); return mockOrders; }
    return (await api.get("/api/admin/orders")).data;
  },

  async updateOrderStatus(id, status) {
    if (USE_MOCKS) { await sleep(); return { id, status }; }
    return (await api.put(`/api/admin/orders/${id}/status`, { status })).data;
  },
};
