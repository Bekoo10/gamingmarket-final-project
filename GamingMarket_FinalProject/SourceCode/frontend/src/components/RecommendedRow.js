import React, { useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ProductCard from "./ProductCard";

function RecommendedRow({
  title = "Recommended for You",
  products = [],
  onAddToCart,
  onViewProduct,
}) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.querySelector("[data-card]");
    const cardWidth = firstCard ? firstCard.clientWidth + 16 : 280;

    container.scrollBy({
      left: direction * cardWidth,
      behavior: "smooth",
    });
  };

  if (!products.length) return null;

  return (
    <Box sx={{ mt: 4, position: "relative" }}>
      <Typography variant="h5" fontWeight={800} mb={2}>
        {title}
      </Typography>

      <Box sx={{ position: "relative" }}>
        {/* Sol ok */}
        <IconButton
          onClick={() => handleScroll(-1)}
          sx={{
            position: "absolute",
            left: -32,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 3,
            color: "error.main",
            bgcolor: "white", // Okun görünmesi için arka plan eklendi
            boxShadow: 2,
            "&:hover": {
              bgcolor: "#f5f5f5",
              transform: "translateY(-50%) scale(1.1)",
            },
            display: { xs: "none", sm: "flex" },
          }}
        >
          <KeyboardArrowLeftIcon sx={{ fontSize: 36 }} />
        </IconButton>

        {/* Ürün kartları */}
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "hidden",
            scrollBehavior: "smooth",
            pr: 2,
            py: 1, // Gölge varsa kesilmemesi için padding
            alignItems: "stretch", // İÇERİDEKİ TÜM ELEMANLARI EN UZUN OLANA EŞİTLER
          }}
        >
          {products.map((p) => (
            <Box
              key={p.id}
              data-card
              sx={{
                minWidth: { xs: 240, sm: 260, md: 280 },
                maxWidth: { xs: 240, sm: 260, md: 280 },
                display: "flex", // Kutuyu flex yapıyoruz
                flexDirection: "column",
                flexShrink: 0,
              }}
            >
              <ProductCard
                product={p}
                onAddToCart={() => onAddToCart?.(p)}
                onView={() =>
                  onViewProduct
                    ? onViewProduct(p)
                    : console.log("Navigate to product detail:", p.id)
                }
                // ProductCard bileşeninin stiline sx={{ height: '100%' }} eklediğinden emin ol
                sx={{ height: "100%", display: "flex", flexDirection: "column" }} 
              />
            </Box>
          ))}
        </Box>

        {/* Sağ ok */}
        <IconButton
          onClick={() => handleScroll(1)}
          sx={{
            position: "absolute",
            right: -32,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 3,
            color: "error.main",
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": {
              bgcolor: "#f5f5f5",
              transform: "translateY(-50%) scale(1.1)",
            },
            display: { xs: "none", sm: "flex" },
          }}
        >
          <KeyboardArrowRightIcon sx={{ fontSize: 36 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default RecommendedRow;