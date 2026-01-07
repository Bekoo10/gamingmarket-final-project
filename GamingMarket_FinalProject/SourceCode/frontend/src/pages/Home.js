import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import ProductCard from "../components/ProductCard";
import RecommendedRow from "../components/RecommendedRow";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { getAllProducts, getFeaturedProducts } from "../services/productService";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 30;

function Home() {
  const { query } = useSearch();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const loadProducts = async () => {
      const featuredData = await getFeaturedProducts();
      const allData = await getAllProducts();
      setFeatured(featuredData);
      setProducts(allData);
    };
    loadProducts();
  }, []);

  const handleView = (id) => navigate(`/products/${id}`);
  const handleAddToCart = (product) => addToCart(product);
  const q = query.trim().toLowerCase();
  const hasQuery = q.length > 0;

  const match = (p) =>
    [p.name, p.shortDescription, p.brand, p.category].some((v) =>
      String(v || "").toLowerCase().includes(q)
    );

  const filteredFeatured = hasQuery ? featured.filter(match) : featured;
  const filteredAll = hasQuery ? products.filter(match) : products;
  const visibleProducts = filteredAll.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAll.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      {!hasQuery && filteredFeatured.length > 0 && (
        <RecommendedRow
          title="Recommended for You"
          products={filteredFeatured}
          onAddToCart={handleAddToCart}
          onViewProduct={(p) => handleView(p.id)}
        />
      )}

      <Typography variant="h5" fontWeight={800} mb={2} mt={hasQuery ? 0 : 4}>
        {hasQuery ? "Search Results" : "All Products"}
      </Typography>

      {hasQuery && filteredAll.length === 0 && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No results for "{query}"
        </Typography>
      )}
      <Grid container spacing={2} alignItems="stretch">
        {visibleProducts.map((p) => (
          <Grid item xs={12} sm={6} md={3} key={p.id} sx={{ display: 'flex' }}>
            <ProductCard
              product={p}
              onView={handleView}
              onAddToCart={handleAddToCart}
              sx={{ flexGrow: 1 }} 
            />
          </Grid>
        ))}
      </Grid>

      {hasMore && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleShowMore}
          >
            Show more products
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default Home;