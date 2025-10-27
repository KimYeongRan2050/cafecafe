// src/App.jsx
import React, { useState, useEffect } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useLocation, 
  useNavigate 
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
import { supabase } from "./services/supabaseClient";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [cart, setCart] = useState([]); // 장바구니 상태
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showAdminLoginPopup, setShowAdminLoginPopup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  //새로고침 시 관리자 로그인 복원
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminInfo");
    if (storedAdmin) {
      setAdminInfo(JSON.parse(storedAdmin));
    }
  }, []);

  // 로그인
  const handleLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("로그인 실패: " + error.message);
      return null;
    }

    const user = data.user;
    if (!user) return null;

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
      // 관리자 로그인이 안 된 경우 팝업 표시
      return (
        <AdminLoginPopup
          onClose={() => {
            setShowAdminLoginPopup(false);
            navigate("/");
          }}
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

  return (
    <>
      {!location.pathname.startsWith("/admin") && (
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
        {/* cart, setCart 전달 */}
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


        {/* 관리자 대시보드 경로 */}
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

      {/* 로그인&회원가입 팝업 */}
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
