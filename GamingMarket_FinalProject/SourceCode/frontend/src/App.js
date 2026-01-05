import Header from "./components/Header";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import OrderSuccess from "./pages/OrderSuccess";
import { SearchProvider } from "./context/SearchContext";
import ProductDetail from "./pages/ProductDetail";
import Help from "./pages/Help";
import SupportRequest from "./pages/SupportRequest";


function App() {
  return (
    <CartProvider>
      <SearchProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/help" element={<Help />} />
          <Route path="/support" element={<SupportRequest />} />
        </Routes>
      </SearchProvider>
    </CartProvider>
  );
}

export default App;
