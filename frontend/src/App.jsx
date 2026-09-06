import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuoteProvider } from "./context/QuoteContext";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Inventory from "./pages/Inventory";
import NutDetails from "./pages/NutDetails";
import Quote from "./pages/Quote";
import Contact from "./pages/Contact";
import Certifications from "./pages/Certifications";

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <QuoteProvider>
        <Routes>

          {/* Existing Pages */}
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/products/nuts"
            element={<NutDetails />}
          />

          <Route path="/inventory" element={<Inventory />} />

          <Route path="/quote" element={<Quote />} />

          <Route path="/contact" element={<Contact />} />

          <Route
            path="/certifications"
            element={<Certifications />}
          />

          {/* Authentication Pages */}
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

        </Routes>
      </QuoteProvider>
    </BrowserRouter>
  );
}

export default App;