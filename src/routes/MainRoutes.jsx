import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '../pages/index.jsx';
import Cart from '../pages/Cart.jsx';
import OrderComplete from '../pages/OrderComplete.jsx';
import PaymentSuccess from '../pages/PaymentSuccess.jsx'; // 결제 성공 페이지 추가

function MainRoutes({ onLogin, onSignupClick }) {

  return(
    <Routes>
      <Route path="/" element={<Index onSignupClick={onSignupClick} />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/order/complete" element={<OrderComplete />} />
      <Route path="/pay/success" element={<PaymentSuccess />} />
    </Routes>
  )
};

export default MainRoutes;