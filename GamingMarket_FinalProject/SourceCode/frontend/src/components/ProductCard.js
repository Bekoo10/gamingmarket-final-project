import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

/**
 * Fiyatı Türk Lirası formatına çevirir.
 */
function formatPrice(price) {
  const n = Number(price) || 0;
  return n.toLocaleString("tr-TR", { minimumFractionDigits: 0 }) + " ₺";
}

export default function ProductCard({ product, onView, onAddToCart, sx }) {
  const {
    id,
    name = "Ürün Adı",
    shortDescription = "",
    price = 0,
    imageUrl,
  } = product || {};

  /**
   * Resim formatı hem string hem dizi olabilir → ilk resmi alıyoruz
   */
  const getFirstImage = () => {
    if (!imageUrl) return "/images/placeholder.png";

    let images = [];

    if (Array.isArray(imageUrl)) {
      images = imageUrl;
    } else if (typeof imageUrl === "string") {
      images = imageUrl.split(",").map((s) => s.trim());
    }

    const first = images.filter(Boolean)[0];
    return first || "/images/placeholder.png";
  };

  const firstImage = getFirstImage();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
        overflow: "hidden",
        transition: "transform .2s, box-shadow .2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 20px -5px rgba(0,0,0,0.15)",
        },
        ...sx,
      }}
    >
      <CardActionArea
        onClick={() => onView && onView(id)}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ------- IMAGE AREA ------- */}
        <Box
          sx={{
            width: "100%",
            height: 220,
            backgroundColor: "#ffffff",   // <-- BEYAZ ARKAPLAN
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderBottom: "1px solid #eeeeee", // ince ayırıcı çizgi
          }}
        >
          <Box
            component="img"
            src={firstImage}
            alt={name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/placeholder.png";
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "8px", // premium görünüm
            }}
          />
        </Box>

        {/* ------- CONTENT AREA ------- */}
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              lineHeight: 1.2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.4em",
              color: "#0f172a",
            }}
          >
            {name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "3em",
              fontSize: ".9rem",
            }}
          >
            {shortDescription}
          </Typography>

          {/* ------- PRICE + BUTTON ------- */}
          <Box
            sx={{
              mt: "auto",
              pt: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight={800} color="primary.main">
              {formatPrice(price)}
            </Typography>

            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart && onAddToCart(product);
              }}
              sx={{
                backgroundColor: "#f3f4f6",
                "&:hover": { backgroundColor: "#e5e7eb" },
              }}
            >
              <ShoppingCartIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
