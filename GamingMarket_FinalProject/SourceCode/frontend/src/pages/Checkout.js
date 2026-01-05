import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Divider,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useCart } from "../context/CartContext";

function digitsOnly(str) {
  return String(str || "").replace(/\D/g, "");
}

function formatCardNumber16(digits) {
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiryMMYY(value) {
  const d = digitsOnly(value).slice(0, 4); // MMYY
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function isValidExpiryMMYY(value) {
  if (!/^\d{2}\/\d{2}$/.test(value)) return false;
  const [mmStr, yyStr] = value.split("/");
  const mm = Number(mmStr);
  const yy = Number(yyStr);
  if (mm < 1 || mm > 12) return false;

  const now = new Date();
  const curYY = now.getFullYear() % 100;
  const curMM = now.getMonth() + 1;

  if (yy < curYY) return false;
  if (yy === curYY && mm < curMM) return false;
  return true;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart, payment } = useCart();

  // 0: Cart, 1: Address, 2: Payment
  const [activeStep, setActiveStep] = useState(0);

  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    district: "",
    addressLine: "",
  });

  const [card, setCard] = useState({
    cardName: "",
    cardNumber: "", // formatted
    expiry: "",     // MM/YY
    cvc: "",        // 3-4 digits
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
    city: false,
    district: false,
    addressLine: false,
    cardName: false,
    cardNumber: false,
    expiry: false,
    cvc: false,
  });

  // ---------- VALIDATIONS ----------
  const phoneDigits = useMemo(
    () => digitsOnly(address.phone).slice(0, 11),
    [address.phone]
  );
  const phoneStartsWithZero = useMemo(
    () => phoneDigits.startsWith("0"),
    [phoneDigits]
  );

  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim()),
    [address.email]
  );

  const addressOk = useMemo(() => {
    return (
      address.fullName.trim().length >= 3 &&
      emailOk &&
      phoneDigits.length === 11 &&
      phoneStartsWithZero &&
      address.city.trim().length >= 2 &&
      address.district.trim().length >= 2 &&
      address.addressLine.trim().length >= 8
    );
  }, [address, emailOk, phoneDigits, phoneStartsWithZero]);

  const cardDigits = useMemo(
    () => digitsOnly(card.cardNumber).slice(0, 16),
    [card.cardNumber]
  );
  const cardNumberOk = useMemo(() => cardDigits.length === 16, [cardDigits]);

  const cvcDigits = useMemo(
    () => digitsOnly(card.cvc).slice(0, 4),
    [card.cvc]
  );
  const cvcOk = useMemo(
    () => cvcDigits.length === 3 || cvcDigits.length === 4,
    [cvcDigits]
  );

  const expiryOk = useMemo(() => isValidExpiryMMYY(card.expiry), [card.expiry]);

  const paymentOk = useMemo(() => {
    return (
      card.cardName.trim().length >= 3 &&
      cardNumberOk &&
      expiryOk &&
      cvcOk
    );
  }, [card, cardNumberOk, expiryOk, cvcOk]);

  const canPlaceOrder = useMemo(() => {
    return items.length > 0 && addressOk && paymentOk;
  }, [items.length, addressOk, paymentOk]);

  // ---------- INPUT HANDLERS ----------
  const handlePhoneChange = (e) => {
    const d = digitsOnly(e.target.value).slice(0, 11);
    setAddress((p) => ({ ...p, phone: d }));
  };

  const handleCardNumberChange = (e) => {
    const d = digitsOnly(e.target.value).slice(0, 16);
    setCard((p) => ({ ...p, cardNumber: formatCardNumber16(d) }));
  };

  const handleExpiryChange = (e) => {
    setCard((p) => ({ ...p, expiry: formatExpiryMMYY(e.target.value) }));
  };

  const handleCvcChange = (e) => {
    const d = digitsOnly(e.target.value).slice(0, 4);
    setCard((p) => ({ ...p, cvc: d }));
  };

  // ---------- STEP CONTROLS ----------
  const steps = ["Review Cart", "Shipping Address", "Payment"];

  const goNextFromCart = () => {
    if (items.length === 0) return;
    setActiveStep(1);
  };

  const goNextFromAddress = () => {
    // mark address fields touched to show errors
    setTouched((t) => ({
      ...t,
      fullName: true,
      email: true,
      phone: true,
      city: true,
      district: true,
      addressLine: true,
    }));
    if (!addressOk) return;
    setActiveStep(2);
  };

  const goBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const handlePlaceOrder = () => {
    // mark payment touched
    setTouched((t) => ({
      ...t,
      cardName: true,
      cardNumber: true,
      expiry: true,
      cvc: true,
    }));
    if (!canPlaceOrder) return;

    payment();
    navigate("/order-success");
  };

  // ---------- UI ----------
  if (items.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={900} mb={2}>
          Checkout
        </Typography>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your cart is empty.
        </Alert>
        <Button component={Link} to="/" variant="contained">
          Go Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={900} mb={2}>
        Checkout
      </Typography>

      {/* ✅ 1-2-3 STEP HEADER */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={3}>
        {/* LEFT: STEP CONTENT */}
        <Grid item xs={12} md={8}>
          {/* STEP 1: CART REVIEW */}
          {activeStep === 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={900} mb={2}>
                Review Cart
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {items.map((x) => (
                  <Box
                    key={x.product.id}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      {x.product.name} × {x.qty}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                      ₺{" "}
                      {(Number(x.product.price) * x.qty).toLocaleString(
                        "tr-TR",
                        { minimumFractionDigits: 2 }
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={800}>Total</Typography>
                <Typography fontWeight={900}>
                  ₺{" "}
                  {Number(total).toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" onClick={goNextFromCart}>
                  Continue
                </Button>
              </Box>
            </Paper>
          )}

          {/* STEP 2: ADDRESS */}
          {activeStep === 1 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={900} mb={2}>
                Shipping Address
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    value={address.fullName}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, fullName: true }))
                    }
                    onChange={(e) =>
                      setAddress((p) => ({ ...p, fullName: e.target.value }))
                    }
                    error={
                      touched.fullName && address.fullName.trim().length < 3
                    }
                    helperText={
                      touched.fullName && address.fullName.trim().length < 3
                        ? "Enter at least 3 characters."
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    value={address.email}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    onChange={(e) =>
                      setAddress((p) => ({ ...p, email: e.target.value }))
                    }
                    error={touched.email && !emailOk}
                    helperText={
                      touched.email && !emailOk ? "Enter a valid email." : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number (start with 0)"
                    fullWidth
                    value={address.phone}
                    onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                    onChange={handlePhoneChange}
                    inputProps={{
                      inputMode: "numeric",
                       maxLength: 11,
                    }}
                    error={
                      touched.phone &&
                      (phoneDigits.length !== 11 || !phoneStartsWithZero)
                    }
                    helperText={
                      touched.phone &&
                      (phoneDigits.length !== 11 || !phoneStartsWithZero)
                      ? "Phone number must be 11 digits and start with 0."
                      : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    fullWidth
                    value={address.city}
                    onBlur={() => setTouched((t) => ({ ...t, city: true }))}
                    onChange={(e) =>
                      setAddress((p) => ({ ...p, city: e.target.value }))
                    }
                    error={touched.city && address.city.trim().length < 2}
                    helperText={
                      touched.city && address.city.trim().length < 2
                        ? "Enter a city."
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="District"
                    fullWidth
                    value={address.district}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, district: true }))
                    }
                    onChange={(e) =>
                      setAddress((p) => ({ ...p, district: e.target.value }))
                    }
                    error={
                      touched.district && address.district.trim().length < 2
                    }
                    helperText={
                      touched.district && address.district.trim().length < 2
                        ? "Enter a district."
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Address Line"
                    fullWidth
                    multiline
                    minRows={2}
                    value={address.addressLine}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, addressLine: true }))
                    }
                    onChange={(e) =>
                      setAddress((p) => ({ ...p, addressLine: e.target.value }))
                    }
                    error={
                      touched.addressLine &&
                      address.addressLine.trim().length < 8
                    }
                    helperText={
                      touched.addressLine &&
                      address.addressLine.trim().length < 8
                        ? "Enter a more detailed address."
                        : ""
                    }
                  />
                </Grid>
              </Grid>

              {!addressOk && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Fill all fields to continue to payment.
                </Alert>
              )}

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button variant="outlined" onClick={goBack}>
                  Back
                </Button>
                <Button variant="contained" onClick={goNextFromAddress}>
                  Continue
                </Button>
              </Box>
            </Paper>
          )}

          {/* STEP 3: PAYMENT */}
          {activeStep === 2 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={900} mb={2}>
                Payment
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name on Card"
                    fullWidth
                    value={card.cardName}
                    onBlur={() => setTouched((t) => ({ ...t, cardName: true }))}
                    onChange={(e) =>
                      setCard((p) => ({ ...p, cardName: e.target.value }))
                    }
                    error={touched.cardName && card.cardName.trim().length < 3}
                    helperText={
                      touched.cardName && card.cardName.trim().length < 3
                        ? "Enter at least 3 characters."
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Card Number (16 digits)"
                    fullWidth
                    value={card.cardNumber}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, cardNumber: true }))
                    }
                    onChange={handleCardNumberChange}
                    inputProps={{ inputMode: "numeric" }}
                    error={touched.cardNumber && !cardNumberOk}
                    helperText={
                      touched.cardNumber && !cardNumberOk
                        ? "Card number must be 16 digits."
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Expiry (MM/YY)"
                    fullWidth
                    value={card.expiry}
                    onBlur={() => setTouched((t) => ({ ...t, expiry: true }))}
                    onChange={handleExpiryChange}
                    inputProps={{ inputMode: "numeric" }}
                    error={touched.expiry && !expiryOk}
                    helperText={
                      touched.expiry && !expiryOk
                        ? "Enter a valid expiry (MM/YY)."
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CVC (3–4 digits)"
                    fullWidth
                    value={card.cvc}
                    onBlur={() => setTouched((t) => ({ ...t, cvc: true }))}
                    onChange={handleCvcChange}
                    inputProps={{ inputMode: "numeric" }}
                    error={touched.cvc && !cvcOk}
                    helperText={
                      touched.cvc && !cvcOk ? "CVC must be 3 or 4 digits." : ""
                    }
                  />
                </Grid>
              </Grid>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button variant="outlined" onClick={goBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handlePlaceOrder}
                  disabled={!canPlaceOrder}
                >
                  Place Order
                </Button>
              </Box>

              {!paymentOk && (
                <Typography sx={{ mt: 1, fontSize: 12 }} color="text.secondary">
                  Fill valid card details to place the order.
                </Typography>
              )}
            </Paper>
          )}
        </Grid>

        {/* RIGHT: ORDER SUMMARY (always visible) */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: "sticky", top: 90 }}>
            <Typography variant="h6" fontWeight={900} mb={2}>
              Order Summary
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {items.map((x) => (
                <Box
                  key={x.product.id}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography sx={{ fontSize: 14 }}>
                    {x.product.name} × {x.qty}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                    ₺{" "}
                    {(Number(x.product.price) * x.qty).toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight={800}>Total</Typography>
              <Typography fontWeight={900}>
                ₺{" "}
                {Number(total).toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
