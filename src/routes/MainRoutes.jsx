// src/routes/MainRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import Cart from "../pages/Cart";
import PaymentSuccess from "../pages/PaymentSuccess";

function MainRoutes({ cart, setCart, showCartPopup, setShowCartPopup }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Index
            cart={cart}
            setCart={setCart}
            showCartPopup={showCartPopup}
            setShowCartPopup={setShowCartPopup}
          />
        }
      />
      <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
      <Route path="/pay/success" element={<PaymentSuccess />} />
    </Routes>
  );
}

export default MainRoutes;
