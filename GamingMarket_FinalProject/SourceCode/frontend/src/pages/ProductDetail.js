import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Box,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogContent,
  Divider,            // 🔹 Divider eklendi
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../context/CartContext";
import { getProductById } from "../services/productService";

// Resim listesini düzenleyen yardımcı fonksiyon
function parseImages(imageUrl) {
  const list = String(imageUrl || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (list.length === 0) return ["https://via.placeholder.com/1200x600"];

  // Eğer 3'ten az resim varsa ilk resmi kopyalayarak 3'e tamamlar
  while (list.length < 3) list.push(list[0]);
  return list.slice(0, 3);
}

// Teknik detayları liste haline getiren yardımcı fonksiyon
function extractSpecs(details) {
  const text = String(details || "").trim();
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•]\s*/, ""));
}

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState(0);

  // Zoom (büyütme) dialog state
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getProductById(id);
      setProduct(data);
      setActiveImg(0);
    };
    load();
  }, [id]);

  const images = useMemo(() => parseImages(product?.imageUrl), [product]);
  const specs = useMemo(
    () => extractSpecs(product?.technicalDetails),
    [product]
  );

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading product...</Typography>
      </Container>
    );
  }

  // Sağ / sol butonları için handler
  const handlePrev = () => {
    setActiveImg((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setActiveImg((prev) => (prev + 1) % images.length);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* SOL KOLON: GÖRSELLER */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #eee",
              p: 1,
              borderRadius: 2,
            }}
          >
            {/* Ana Büyük Resim Kutusu */}
            <Box
              sx={{
                width: "100%",
                height: 450,
                backgroundColor: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                cursor: "zoom-in",
              }}
              onClick={() => setZoomOpen(true)}
            >
              {/* Sol ok */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                sx={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.8)",
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>

              {/* Sağ ok */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.8)",
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
              >
                <ChevronRightIcon />
              </IconButton>

              <Box
                component="img"
                src={images[activeImg]}
                alt={product.name}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  transition: "0.3s ease",
                }}
              />
            </Box>

            {/* Küçük Resim Seçiciler */}
            <Box
              sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "center" }}
            >
              {images.map((src, idx) => (
                <Box
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  sx={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                    borderRadius: 2,
                    cursor: "pointer",
                    overflow: "hidden",
                    border:
                      idx === activeImg ? "2px solid #1976d2" : "1px solid #ddd",
                    opacity: idx === activeImg ? 1 : 0.7,
                    "&:hover": { opacity: 1, borderColor: "#1976d2" },
                  }}
                >
                  <img
                    src={src}
                    alt={`thumb-${idx}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* SAĞ KOLON: ÜRÜN BİLGİLERİ */}
        <Grid item xs={12} md={6}>
          <Box sx={{ pl: { md: 2 } }}>
            <Typography variant="h4" fontWeight={900} gutterBottom>
              {product.name}
            </Typography>

            <Typography
              variant="h5"
              color="primary"
              fontWeight={800}
              sx={{ mb: 2 }}
            >
              {Number(product.price).toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
              })}{" "}
              ₺
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.7 }}
            >
              {product.shortDescription}
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => addToCart(product)}
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* ALT KISIM: TABLAR (Detaylar) */}
      <Paper
        sx={{ mt: 6, borderRadius: 2, overflow: "hidden" }}
        elevation={1}
      >
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fafafa" }}
        >
          <Tab label="Description" sx={{ fontWeight: "bold" }} />
          <Tab label="Technical Specs" sx={{ fontWeight: "bold" }} />
          <Tab label="Shipping & Warranty" sx={{ fontWeight: "bold" }} />
        </Tabs>

        <Box sx={{ p: 4 }}>
          {/* AÇIKLAMA */}
          {tab === 0 && (
            <Box>
              <Typography variant="h6" fontWeight={800} mb={2}>
                Product Description
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}
              >
                {product.details ||
                  "This product is designed for high-performance use. Detailed information can be found in the technical specs tab."}
              </Typography>
            </Box>
          )}

          {/* TEKNİK ÖZELLİKLER */}
          {tab === 1 && (
            <Box>
              <Typography variant="h6" fontWeight={800} mb={2}>
                Technical Specifications
              </Typography>
              {specs.length === 0 ? (
                <Typography color="text.secondary">
                  No technical specifications added yet.
                </Typography>
              ) : (
                <Grid container spacing={1}>
                  {specs.map((s, i) => (
                    <Grid item xs={12} key={i}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                          }}
                        />
                        <Typography variant="body1">{s}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* KARGO & GARANTİ */}
          {tab === 2 && (
            <Grid container spacing={3}>
              {/* Fast Shipping */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    bgcolor: "#f5f5f5",   // 🔹 açık gri arka plan
                    borderRadius: 2,
                    p: 2.5,
                  }}
                >
                  <Typography variant="h6" fontWeight={800} mb={1}>
                    🚚 Fast Shipping
                  </Typography>
                  <Typography color="text.secondary">
                    Your order will be shipped within{" "}
                    <b>1–3 business days</b>.
                  </Typography>
                </Box>
              </Grid>

              {/* Ayırıcı çizgi */}
              <Grid item xs={12}>
                <Divider sx={{ my: 0.5 }} />
              </Grid>

              {/* Warranty & Returns */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    bgcolor: "#f5f5f5",   // 🔹 aynı açık gri arka plan
                    borderRadius: 2,
                    p: 2.5,
                  }}
                >
                  <Typography variant="h6" fontWeight={800} mb={1}>
                    🛡 Warranty & Returns
                  </Typography>
                  <Typography color="text.secondary">
                    All products are covered by a <b>2-year warranty</b>. 14-day
                    return policy.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>

      {/* BÜYÜK GÖRSEL DIALOG (ZOOM) */}
      <Dialog
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent
          sx={{
            position: "relative",
            bgcolor: "#ffffffff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          {/* Kapat butonu */}
          <IconButton
            onClick={() => setZoomOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#000000ff",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Sol ok (zoom içi) */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#000000ff",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Sağ ok (zoom içi) */}
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#000000ff",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          <Box
            component="img"
            src={images[activeImg]}
            alt={product.name}
            sx={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default ProductDetail;
