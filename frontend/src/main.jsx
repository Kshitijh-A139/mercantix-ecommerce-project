import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OrdersProvider>
          <CartProvider>
            <App />
            <Toaster
              position="top-right"
              offset={20}
              gap={10}
              toastOptions={{
                duration: 3200,
                classNames: {
                  toast:
                    "!bg-[var(--color-ivory)] !border !border-[var(--color-sand)] !text-[var(--color-ink)] !shadow-[0_10px_30px_rgba(11,15,14,0.12)] !rounded-md !font-sans",
                  title: "!font-medium !text-[14px]",
                  description: "!text-[12px] !text-[var(--color-mist)]",
                  success: "!border-l-2 !border-l-[var(--color-bronze-600)]",
                  error: "!border-l-2 !border-l-[var(--color-danger)]",
                  info: "!border-l-2 !border-l-[var(--color-ink)]",
                },
              }}
            />
          </CartProvider>
        </OrdersProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
