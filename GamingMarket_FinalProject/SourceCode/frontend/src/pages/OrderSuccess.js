import React from "react";
import { Container, Typography, Paper, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function generateTrackingNumber() {
  return "GM-" + Math.floor(10000000 + Math.random() * 90000000);
}

function OrderSuccess() {
  const navigate = useNavigate();
  const trackingNumber = generateTrackingNumber();

  return (
    <Container sx={{ py: 6, textAlign: "center" }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Order Successful 🎉
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Your order has been successfully placed.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          Tracking Number: <br />
          <Box component="span" sx={{ color: "primary.main" }}>
            {trackingNumber}
          </Box>
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          You can use this tracking number to follow your shipment.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </Button>
      </Paper>
    </Container>
  );
}

export default OrderSuccess;
