import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const CartContext = createContext(null);
const STORAGE_KEY = "gamingmarket_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // ✅ Snackbar state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false }));
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.product.id === product.id);
      if (existing) {
        return prev.map((x) =>
          x.product.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prev, { product, qty: 1 }];
    });

    // ✅ Toast message
    showToast(`Added to cart: ${product?.name || "Product"}`, "success");
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((x) => x.product.id !== productId));
    showToast("Removed from cart", "info");
  };

  const updateQty = (productId, qty) => {
    const safeQty = Math.max(1, Number(qty || 1));
    setItems((prev) =>
      prev.map((x) => (x.product.id === productId ? { ...x, qty: safeQty } : x))
    );
    showToast("Cart updated", "success");
  };

  const clearCart = () => {
    setItems([]);
    showToast("Cart cleared", "info");
  };

  const payment = () => {
    setItems([]);
    showToast("Payment Completed Successfully", "info");
  };

  const cartCount = useMemo(
    () => items.reduce((sum, x) => sum + x.qty, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, x) => sum + Number(x.product.price) * x.qty, 0),
    [items]
  );

  const value = {
    items,
    cartCount,
    total,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    payment,
    showToast, // Başka yerlerde de kullanılabilir
  };

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* ✅ Global Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2200}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
