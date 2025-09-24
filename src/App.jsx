// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Index from './pages/index.jsx';
import MainRoutes from './routes/MainRoutes';
import AdminRoutes from './admin/routes/AdminRoutes.jsx';
import Header from './components/Header.jsx';
import { supabase } from './services/supabaseClient.js';


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

    if (error || !data) return null;

    const isMatch = pw === data.password;
    if (!isMatch) return null;

    return {
      id: data.custom_id,
      name: data.name,
      email: data.email
    };
  };

  // 관리자 시 정보 추가
  const handleAdminLogin = async (email, password) => {
    // 1. Supabase Auth 인증
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData?.user) {
      alert("로그인 실패: " + authError.message);
      return null;
    }

    // 2. member 테이블에서 관리자 권한 확인
    const { data: memberData, error: memberError } = await supabase
      .from("member")
      .select("name, role, is_verified, password")
      .eq("id", authData.user.id)
      .single();

    if (memberError || !memberData || !memberData.is_verified) {
      alert("관리자 권한이 없습니다.");
      return null;
    }

    return {
      name: memberData.name,
      role: memberData.role,
      email: authData.user.email
    };
  };


  //const handleSignup = (member) => {
    //setMembers(prev => [...prev, { ...member, id: Date.now() }]);
  //};

  return (
    <>
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
      </Routes>
    </>
  );
}

export default App;
