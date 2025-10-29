// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import LoginPopup from "./pages/LoginPopup";
import Signup from "./pages/Signup";
import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import ProductManage from "./admin/pages/ProductManage";
import OrderManage from "./admin/pages/OrderManage";
import SalesManage from "./admin/pages/SalesManage";
import SalesReport from "./admin/pages/SalesReport";
import MemberManage from "./admin/pages/MemberManage";
import UserManage from "./admin/pages/UserManage";
import MainRoutes from "./routes/MainRoutes";
import AdminLoginPopup from "./admin/popup/AdminLoginPopup";
import PaymentSuccess from "./pages/PaymentSuccess"; // 결제완료 페이지 import
import { supabase } from "./services/supabaseClient";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 새로고침 시 관리자 로그인 복원
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminInfo");
    if (storedAdmin) setAdminInfo(JSON.parse(storedAdmin));
  }, []);

  // 로그인
  const handleLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("로그인 실패: " + error.message);
      return;
    }

    const user = data.user;
    if (!user) return;

    const { data: member } = await supabase
      .from("members")
      .select("uuid, name, email")
      .eq("email", email)
      .maybeSingle();

    if (member) {
      setUserInfo(member);
      localStorage.setItem("user_name", member.name);
      localStorage.setItem("user_email", member.email);
      alert(`${member.name}님 환영합니다!`);
      navigate("/");
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserInfo(null);
    setAdminInfo(null);
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  // 관리자 보호 라우트
  const ProtectedAdminRoute = ({ children }) => {
    if (!adminInfo) {
      return (
        <AdminLoginPopup
          onClose={() => navigate("/")}
          onLoginSuccess={(admin) => {
            setAdminInfo(admin);
            navigate("/admin/dashboard");
          }}
        />
      );
    }
    return children;
  };

  // 세션 복원
  useEffect(() => {
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session?.user) return;

      const email = session.user.email;
      const { data: member } = await supabase
        .from("members")
        .select("uuid, name, email")
        .eq("email", email)
        .maybeSingle();

      if (member) setUserInfo(member);
    };
    restoreSession();
  }, []);

  // 특정 페이지(Header 숨기기)
  const hideHeaderPaths = ["/admin", "/order-complete", "/pay/success"];
  const shouldHideHeader = hideHeaderPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideHeader && (
        <Header
          cart={cart}
          setCart={setCart}
          showCartPopup={showCartPopup}
          setShowCartPopup={setShowCartPopup}
          onCartClick={() => setShowCartPopup(true)}
          userInfo={userInfo}
          onLoginClick={() => setShowLogin(true)}
          onLogout={handleLogout}
          onAdminLogin={(admin) => setAdminInfo(admin)}
        />
      )}

      <Routes>
        {/* 사용자 메인 라우트 */}
        <Route
          path="/*"
          element={
            <MainRoutes
              cart={cart}
              setCart={setCart}
              showCartPopup={showCartPopup}
              setShowCartPopup={setShowCartPopup}
            />
          }
        />

        {/* 결제 완료 페이지 (Header 없이 팝업 + 자동이동) */}
        <Route path="/order-complete" element={<PaymentSuccess />} />

        {/* 관리자 영역 */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout adminInfo={adminInfo} onLogout={handleLogout} />
            </ProtectedAdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="product" element={<ProductManage />} />
          <Route path="supplies" element={<OrderManage />} />
          <Route path="sales" element={<SalesManage />} />
          <Route path="sales-report" element={<SalesReport />} />
          <Route path="member" element={<MemberManage />} />
          <Route path="users" element={<UserManage />} />
        </Route>
      </Routes>

      {/* 로그인 & 회원가입 팝업 */}
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onLoginSuccess={(user) => {
            setUserInfo(user);
            navigate("/");
          }}
        />
      )}
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </>
  );
}

export default App;
