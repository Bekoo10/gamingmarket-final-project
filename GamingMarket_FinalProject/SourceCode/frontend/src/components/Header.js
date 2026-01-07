import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Badge,
  Button,
  Popover,
  Paper,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const MEGA = {
  peripherals: {
    title: "Peripherals",
    items: [
      { label: "Monitor", sub: "monitor" },
      { label: "Mouse", sub: "mouse" },
      { label: "Keyboard", sub: "keyboard" },
      { label: "Headset", sub: "headset" },
      { label: "Mouse Pad", sub: "mousepad" },
      { label: "Gamepad", sub: "gamepad" },
      { label: "Laptop Cooler", sub: "cooler" },
      { label: "Gaming Chair", sub: "chair" },
    ],
  },
  components: {
    title: "Computer Components",
    items: [
      { label: "Case", sub: "case" },
      { label: "CPU", sub: "cpu" },
      { label: "Motherboard", sub: "motherboard" },
      { label: "RAM", sub: "ram" },
      { label: "GPU", sub: "gpu" },
      { label: "SSD", sub: "ssd" },
      { label: "PSU", sub: "psu" },
      { label: "Cooling", sub: "cooling" },
    ],
  },
};

const navButtonStyle = {
  color: "white",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "white",
    color: "#0f172a",
  },
};

function MegaMenu({ anchorEl, open, onClose, onKeepOpen, categoryKey }) {
  const navigate = useNavigate();
  const data = MEGA[categoryKey];
  if (!data) return null;

  const handleGo = (sub) => {
    navigate(`/category/${categoryKey}?sub=${encodeURIComponent(sub)}`);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      disableScrollLock
      sx={{
        pointerEvents: "none",
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        onMouseEnter: onKeepOpen,
        onMouseLeave: onClose,
        sx: {
          pointerEvents: "auto",
          mt: 0.5,
          width: "min(1000px, 92vw)",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
        },
      }}
    >
      <Paper sx={{ p: 3 }}>
        <Typography fontWeight={900} sx={{ mb: 2 }}>
          {data.title}
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
          {data.items.map((it) => (
            <Box
              key={it.sub}
              onClick={() => handleGo(it.sub)}
              sx={{
                display: "flex",
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(17,24,39,0.06)" },
              }}
            >
              <Box>
                <Typography fontWeight={800}>{it.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  View {it.label.toLowerCase()} products
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Popover>
  );
}

function Header() {
  const { cartCount } = useCart();
  const { query, setQuery } = useSearch();

  const [mega, setMega] = useState({ open: false, anchorEl: null, key: null });
  const closeTimerRef = useRef(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMega = (key) => (e) => {
    clearCloseTimer();
    setMega({ open: true, anchorEl: e.currentTarget, key });
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setMega({ open: false, anchorEl: null, key: null });
    }, 200);
  };

  const keepOpen = () => {
    clearCloseTimer();
  };

  const closeNow = () => {
    clearCloseTimer();
    setMega({ open: false, anchorEl: null, key: null });
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#0f172a", backgroundImage: "none" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Typography
          variant="h6"
          fontWeight={900}
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "white" }}
        >
          GamingMarket
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#111827",
            px: 2,
            py: 0.5,
            borderRadius: 2,
            flex: 1,
            maxWidth: 520,
          }}
        >
          <SearchIcon sx={{ mr: 1, opacity: 0.8 }} />
          <InputBase
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ color: "white", width: "100%" }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Button
            component={Link}
            to="/help"
            color="inherit"
            startIcon={
              <Badge badgeContent={0} color="error">
                <ChatBubbleOutlineIcon />
              </Badge>
            }
            sx={{
              textTransform: "none",
              fontSize: "1.05rem",
              fontWeight: 600,
              gap: 0.01,
            }}
          >
            Customer Support
          </Button>
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          px: 2,
          py: 0.5,
          backgroundColor: "#111827",
        }}
      >
        <Button component={Link} to="/category/desktop" sx={navButtonStyle}>
          Desktop
        </Button>

        <Button component={Link} to="/category/laptop" sx={navButtonStyle}>
          Laptop
        </Button>

        <Button
          onMouseEnter={openMega("peripherals")}
          onMouseLeave={scheduleClose}
          sx={navButtonStyle}
        >
          Peripherals
        </Button>

        <Button
          onMouseEnter={openMega("components")}
          onMouseLeave={scheduleClose}
          sx={navButtonStyle}
        >
          Computer Components
        </Button>
      </Box>

      <MegaMenu
        anchorEl={mega.anchorEl}
        open={mega.open}
        onClose={closeNow}
        onKeepOpen={keepOpen}
        categoryKey={mega.key}
      />
    </AppBar>
  );
}

export default Header;