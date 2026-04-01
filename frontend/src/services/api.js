import axios from 'axios';

const BASE_URL = 'http://localhost:9090/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────
export const loginUser = (data) =>
  api.post('/auth/login', data);

export const registerUser = (data) =>
  api.post('/auth/register', data);

export const logoutUser = () =>
  api.post('/auth/logout');

// ── Products ──────────────────────────────────────
export const getProducts = (params = {}) =>
  api.get('/products', { params });

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const getCategories = () =>
  api.get('/categories');

// ── Cart ──────────────────────────────────────────
export const getCart = () =>
  api.get('/cart');

export const addToCart = (product) =>
  api.post('/cart/add', product);

export const updateCartItem = (itemId, quantity) =>
  api.put(`/cart/${itemId}`, { quantity });

export const removeCartItem = (itemId) =>
  api.delete(`/cart/${itemId}`);

export const clearCart = () =>
  api.delete('/cart/clear');

// ── Orders ────────────────────────────────────────
export const placeOrder = (orderData) =>
  api.post('/orders', orderData);

export const getOrders = () =>
  api.get('/orders');

export default api;
