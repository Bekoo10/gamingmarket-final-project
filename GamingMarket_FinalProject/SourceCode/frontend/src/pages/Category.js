import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext"; 
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import ProductCard from "../components/ProductCard";
import { getProductsByCategory } from "../services/productService";
import { useNavigate } from "react-router-dom";

const categoryTitleMap = {
  desktop: "Desktop Computers",
  laptop: "Laptops",
  peripherals: "Peripherals",
  components: "Computer Components",
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function Category() {
  const { addToCart } = useCart();
  const { query } = useSearch(); 
  const { slug } = useParams();
  const queryParam = useQuery();
  const navigate = useNavigate();

  const sub = (queryParam.get("sub") || "").trim().toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const load = async () => {
      try {
        const data = await getProductsByCategory(slug, sub || undefined);
        setProducts(data);
      } catch (e) {
        setError("No products found in this category.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, sub]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
  );

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={800} mb={2}>
        {categoryTitleMap[slug] || slug}
        {sub ? ` / ${sub.toUpperCase()}` : ""}

        {query && (
          <Typography component="span" variant="h6" color="primary.main" sx={{ ml: 2 }}>
            - Searching: "{query}"
          </Typography>
        )}
      </Typography>

      {filteredProducts.length === 0 ? (
        <Typography color="text.secondary">
          {query 
            ? `No products matching "${query}" found in this category.` 
            : "No products found for this filter."}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredProducts.map((p) => (
            <Grid item xs={12} sm={6} md={3} key={p.id}>
              <ProductCard
                product={p}
                onView={(id) => navigate(`/products/${id}`)}
                onAddToCart={() => addToCart(p)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Category;