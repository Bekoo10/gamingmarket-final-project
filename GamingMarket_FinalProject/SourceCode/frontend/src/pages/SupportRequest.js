import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert
} from "@mui/material";

const ISSUE_TYPES = [
  { value: "order", label: "Order / Invoice Problem" },
  { value: "delivery", label: "Delivery / Cargo Problem" },
  { value: "product", label: "Product / Defect Problem" },
  { value: "payment", label: "Payment / Refund Problem" },
  { value: "account", label: "Account / Login Problem" },
  { value: "other", label: "Other" },
];

function SupportRequest() {
  const [issueType, setIssueType] = useState("");
  const [otherIssue, setOtherIssue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState({});
  const [touchedPhone, setTouchedPhone] = useState(false);

  // success toast state
  const [toastOpen, setToastOpen] = useState(false);

  // email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // phone digits only
  const formatPhone = (value) => value.replace(/\D/g, "");

  const validateForm = () => {
    const newErrors = {};

    if (!issueType) newErrors.issueType = "Issue type is required.";
    if (issueType === "other" && !otherIssue)
      newErrors.otherIssue = "Please describe your issue.";

    if (!name) newErrors.name = "Full name is required.";

    if (!email) newErrors.email = "E-mail is required.";
    else if (!emailRegex.test(email))
      newErrors.email = "Enter a valid e-mail address.";

    const phoneDigits = formatPhone(phone);

    if (!phoneDigits) {
      newErrors.phone = "Phone number is required.";
    } else if (phoneDigits.length !== 11 || !phoneDigits.startsWith("0")) {
      newErrors.phone = "Phone number must be 11 digits and start with 0.";
    }

    if (!details) newErrors.details = "Please describe your problem.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload = {
      issueType,
      otherIssue,
      name,
      email,
      phone: formatPhone(phone),
      orderId,
      details,
    };

    console.log("Support request submitted:", payload);

    // show toast
    setToastOpen(true);

    // show success page
    setSubmitted(true);
  };

  const phoneDigits = formatPhone(phone);
  const phoneInvalid =
    phoneDigits.length !== 11 || !phoneDigits.startsWith("0");

  if (submitted) {
    return (
      <Container sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={900} gutterBottom>
            Request Received ✅
          </Typography>

          <Typography sx={{ mb: 1 }}>
            Thank you for contacting our support team.
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            We will review your request and get back to you via e-mail as soon
            as possible.
          </Typography>

          <Button variant="contained" href="/">
            Return to Home Page
          </Button>
        </Paper>

        {/* SUCCESS TOAST BOTTOM RIGHT */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={4000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setToastOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Your support request has been received successfully.
          </Alert>
        </Snackbar>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={900} gutterBottom>
        Contact Support
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Please select your issue and share your contact information. All fields
        are required.
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {/* STEP 1 — ISSUE TYPE */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
            1. Select your issue
          </Typography>

          <TextField
            select
            label="Issue Type"
            fullWidth
            value={issueType}
            error={!!errors.issueType}
            helperText={errors.issueType}
            onChange={(e) => setIssueType(e.target.value)}
          >
            {ISSUE_TYPES.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          {issueType === "other" && (
            <TextField
              label="Please describe your issue briefly"
              fullWidth
              sx={{ mt: 2 }}
              value={otherIssue}
              error={!!errors.otherIssue}
              helperText={errors.otherIssue}
              onChange={(e) => setOtherIssue(e.target.value)}
            />
          )}
        </Box>

        {/* STEP 2 — CONTACT INFO */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
            2. Your contact information
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              label="Full Name"
              fullWidth
              value={name}
              error={!!errors.name}
              helperText={errors.name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="E-mail"
              fullWidth
              value={email}
              error={!!errors.email}
              helperText={errors.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>

          <Typography
            color="text.secondary"
            sx={{ mb: 0.5, fontSize: 13 }}
          >
          </Typography>

          <TextField
            label="Phone Number (start with 0)"
            fullWidth
            value={phone}
            onBlur={() => setTouchedPhone(true)}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            inputProps={{
              inputMode: "numeric",
              maxLength: 11,
            }}
            error={!!errors.phone || (touchedPhone && phoneInvalid)}
            helperText={
              errors.phone ||
              (touchedPhone && phoneInvalid
                ? "Phone number must be 11 digits and start with 0."
                : "")
            }
            sx={{ mb: 2 }}
          />

          <TextField
            label="Order ID (optional)"
            fullWidth
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </Box>

        {/* STEP 3 — DETAILS */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
            3. Describe your problem in detail
          </Typography>

          <TextField
            placeholder="Please write your complaint or request in detail..."
            fullWidth
            multiline
            minRows={5}
            value={details}
            error={!!errors.details}
            helperText={errors.details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Button variant="contained" size="large" onClick={handleSubmit}>
            Submit your request
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SupportRequest;
