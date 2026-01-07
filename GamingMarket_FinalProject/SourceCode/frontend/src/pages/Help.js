import React from "react";
import {
  Container,
  Typography,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate } from "react-router-dom";

function Help() {
  const navigate = useNavigate();

  const goToSupportForm = () => {
    navigate("/support");
  };

  return (
    <Container sx={{ py: 6 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={900} gutterBottom>
        Customer Support
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* FAQ */}
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
        Frequently Asked Questions
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          How long does delivery take?
        </AccordionSummary>
        <AccordionDetails>
          Orders are shipped within 1–3 business days. Delivery time may vary
          depending on your region and courier availability.
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Can I return a product?
        </AccordionSummary>
        <AccordionDetails>
          Yes — you may request a return within 14 days if the product is unused
          and in original packaging.
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Which payment methods are supported?
        </AccordionSummary>
        <AccordionDetails>
          Credit / Debit Card, online payment, and installment plans (where
          available).
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 4 }} />

      {/* Contact Support Card */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={800}>
          Need further assistance?
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Our support team is ready to help you with your questions, complaints,
          or requests.
        </Typography>

        <Button
          variant="contained"
          startIcon={<ChatBubbleOutlineIcon />}
          size="large"
          onClick={goToSupportForm}
        >
          Contact Support
        </Button>
      </Paper>
    </Container>
  );
}

export default Help;
