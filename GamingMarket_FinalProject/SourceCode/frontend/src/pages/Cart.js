import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  IconButton,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const { items, total, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();

  // Her ürün için input'ta görünen qty'leri burada tutuyoruz (string)
  const [qtyInputs, setQtyInputs] = useState({});

  // Sepet değiştiğinde input değerlerini güncelle
  useEffect(() => {
    const initial = {};
    items.forEach(({ product, qty }) => {
      initial[product.id] = String(qty);
    });
    setQtyInputs(initial);
  }, [items]);

  // Input değiştiğinde (yazma + ok tuşları)
  const handleQtyChange = (productId, value) => {
    // Ekranda görünen değeri direkt yaz
    setQtyInputs((prev) => ({
      ...prev,
      [productId]: value,
    }));

    // Kullanıcı tamamen sildiyse, şimdilik sadece input state’i güncelle
    if (value === "") return;

    const n = parseInt(value, 10);
    // Geçerli sayı değilse veya 1'den küçükse hemen güncelleme
    if (isNaN(n) || n < 1) return;

    // Geçerli bir sayıysa hemen cart context’i güncelle
    updateQty(productId, n);
  };

  // Input'tan çıkınca (boş veya hatalı ise 1’e çek)
  const handleQtyBlur = (productId) => {
    setQtyInputs((prev) => {
      const raw = prev[productId];
      let n = parseInt(raw, 10);

      if (isNaN(n) || n < 1) {
        n = 1;
      }
          const item = items.find((it) => it.product.id === productId);
    // qty zaten aynıysa updateQty çağırma → snackbar çıkmaz
    if (!item || item.qty === n) {
      return {
        ...prev,
        [productId]: String(n),
      };
    }

      updateQty(productId, n);

      return {
        ...prev,
        [productId]: String(n),
      };
    });
  };

  if (items.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight={800} mb={1}>
          Your Cart
        </Typography>
        <Typography color="text.secondary" mb={2}>
          Your cart is empty.
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Go Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={800} mb={2}>
        Your Cart
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        {items.map(({ product, qty }, idx) => (
          <Box key={product.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                py: 1,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700}>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.shortDescription}
                </Typography>
                <Typography sx={{ mt: 0.5 }}>
                  ₺{" "}
                  {Number(product.price).toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}
                </Typography>
              </Box>

              <TextField
                label="Qty"
                type="number"
                size="small"
                value={qtyInputs[product.id] ?? ""}
                onChange={(e) =>
                  handleQtyChange(product.id, e.target.value)
                }
                onBlur={() => handleQtyBlur(product.id)}
                inputProps={{ min: 1 }}
                sx={{ width: 90 }}
              />

              <IconButton onClick={() => removeFromCart(product.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            {idx !== items.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>

      {/* ✅ TOTAL + CHECKOUT + (ALTA) CONTINUE/CLEAR */}
      <Paper sx={{ p: 2 }}>
        {/* ÜST SATIR: Total + Proceed */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <Typography variant="h6" fontWeight={800}>
            Total: ₺{" "}
            {Number(total).toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
            })}
          </Typography>

          <Button variant="contained" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </Button>
        </Box>

        {/* ALT SATIR: solda continue, sağda clear */}
        <Box
          sx={{
            mt: 2,
            pt: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Button
            component={Link}
            to="/"
            sx={{ textTransform: "none", fontWeight: 700, color: "#111827" }}
          >
            ← Continue Shopping
          </Button>

          <Button
            onClick={clearCart}
            sx={{ textTransform: "none", fontWeight: 700, color: "#111827" }}
          >
            Clear Cart
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Cart;
