import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/PageLoader";
import ErrorBoundary from "./components/ErrorBoundary";

// Eager — landing + auth surfaces (rendered immediately on first hit)
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Customer flow — lazy
const Home          = lazy(() => import("./pages/Home"));
const Products      = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart          = lazy(() => import("./pages/Cart"));
const Checkout      = lazy(() => import("./pages/Checkout"));
const OrderPlaced   = lazy(() => import("./pages/OrderPlaced"));
const Orders        = lazy(() => import("./pages/Orders"));
const Placeholder   = lazy(() => import("./pages/_Placeholder"));

// Admin — lazy (a separate, larger bundle that customer-only users never pay for)
const AdminLayout      = lazy(() => import("./admin/layouts/AdminLayout"));
const AdminLogin       = lazy(() => import("./admin/pages/Login"));
const AdminDashboard   = lazy(() => import("./admin/pages/Dashboard"));
const AdminProducts    = lazy(() => import("./admin/pages/Products"));
const AdminProductForm = lazy(() => import("./admin/pages/ProductForm"));
const AdminUsers       = lazy(() => import("./admin/pages/Users"));
const AdminOrders      = lazy(() => import("./admin/pages/Orders"));
const AdminSales       = lazy(() => import("./admin/pages/Sales"));

export default function App() {
  return (
    <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Entry — full-screen welcome */}
        <Route path="/" element={<Welcome />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Customer flow */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout"          element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-placed/:id"  element={<ProtectedRoute><OrderPlaced /></ProtectedRoute>} />
          <Route path="/orders"            element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/account"           element={<ProtectedRoute><Placeholder title="My Account" /></ProtectedRoute>} />
          <Route path="/account/wishlist"  element={<ProtectedRoute><Placeholder title="Wishlist" /></ProtectedRoute>} />
          <Route path="/account/addresses" element={<ProtectedRoute><Placeholder title="Address Book" /></ProtectedRoute>} />
          <Route path="/account/settings"  element={<ProtectedRoute><Placeholder title="Settings" /></ProtectedRoute>} />
          {/* Branded 404 inside the storefront chrome */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin console */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index                       element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard"            element={<AdminDashboard />} />
          <Route path="products"             element={<AdminProducts />} />
          <Route path="products/new"         element={<AdminProductForm />} />
          <Route path="products/:id/edit"    element={<AdminProductForm />} />
          <Route path="orders"               element={<AdminOrders />} />
          <Route path="users"                element={<AdminUsers />} />
          <Route path="sales"                element={<AdminSales />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
    </ErrorBoundary>
  );
}
