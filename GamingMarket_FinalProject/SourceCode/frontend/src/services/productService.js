import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// ✅ All products
export async function getAllProducts() {
  const res = await API.get("/products");
  return res.data;
}

// ✅ Featured products
export async function getFeaturedProducts() {
  const res = await API.get("/products/featured");
  return res.data;
}

// ✅ Product by id
export async function getProductById(id) {
  const res = await API.get(`/products/${id}`);
  return res.data;
}

// ✅ Category + optional sub filter
// Example:
// getProductsByCategory("components") -> /api/products/category/components
// getProductsByCategory("components", "ram") -> /api/products/category/components?sub=ram
export async function getProductsByCategory(category, sub) {
  const params = {};
  if (sub) params.sub = sub;

  const res = await API.get(`/products/category/${category}`, { params });
  return res.data;
}
