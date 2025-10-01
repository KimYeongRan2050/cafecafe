// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Index from './pages/index.jsx';
import MainRoutes from './routes/MainRoutes';
import AdminRoutes from './admin/routes/AdminRoutes.jsx';
import Header from './components/Header.jsx';
import { supabase } from './services/supabaseClient.js';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';


function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false);

  const location = useLocation();

  const handleCartClick = () => {
    // 예시: 장바구니 팝업 토글
    console.log("Cart clicked");
  };

  // 로그인 시 정보 추가
  const handleLogin = async (id, pw) => {
    const { data, error } = await supabase
      .from("members")
      .select("custom_id, password, name, email")
      .eq("custom_id", id)
      .single();

    if (error || !data || pw !== data.password) return null;

    return {
      id: data.custom_id,
      name: data.name,
      email: data.email
    };
  };

  return (
    <AdminAuthProvider>
      {!location.pathname.startsWith("/admin") && (
        <Header
          cart={cart}
          setCart={setCart}
          showCartPopup={showCartPopup}
          setShowCartPopup={setShowCartPopup}
          onCartClick={() => setShowCartPopup(true)}
          onLogin={handleLogin}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      )}

      <Routes>
        <Route path="/" element={<Index cart={cart} setCart={setCart} />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<MainRoutes onLogin={handleLogin} />} />
        {/* <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/order/complete" element={<OrderComplete />} /> */}
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
