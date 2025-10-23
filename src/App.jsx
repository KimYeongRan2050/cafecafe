import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/index.jsx";
import Header from "./components/Header.jsx";
import LoginPopup from "./pages/LoginPopup.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import { supabase } from "./services/supabaseClient.js";

function App() {
  const [userInfo, setUserInfo] = useState(null); // 일반 회원 정보
  const [adminInfo, setAdminInfo] = useState(null); // 관리자 정보
  const [cart, setCart] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [session, setSession] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 일반 사용자 로그인
  const handleLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("로그인 실패: " + error.message);
      return null;
    }

    const user = data.user;
    if (!user) return null;

    const { data: member } = await supabase
      .from("members")
      .select("name, email")
      .eq("uuid", user.id)
      .single();

    if (member) {
      const info = { name: member.name, email: member.email, uuid: user.id };
      setUserInfo(info);
      localStorage.setItem("user_name", member.name);
      localStorage.setItem("user_email", member.email);
      return info;
    }
    return null;
  };

  // 로그아웃 (공통)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserInfo(null);
    setAdminInfo(null);
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  // 세션 복원 (회원 / 관리자 모두)
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      setSession(session);

      if (session?.user) {
        const email = session.user.email;

        // users 테이블에서 role 확인 (관리자 / 직원)
        const { data: userRecord, error: userError } = await supabase
          .from("users")
          .select("email, role, name")
          .ilike("email", email)
          .single();

        if (userError) {
          console.error("Supabase users 조회 실패:", userError.message);
        }

        if (userRecord && (userRecord.role === "admin" || userRecord.role === "staff")) {
          // 관리자 로그인 상태 복원
          setAdminInfo({
            email: userRecord.email,
            role: userRecord.role,
            name: userRecord.name || "관리자",
          });
        } else {
          // 일반 회원 로그인 상태 복원
          const { data: member } = await supabase
            .from("members")
            .select("name, email")
            .eq("uuid", session.user.id)
            .single();

          if (member) {
            setUserInfo({ name: member.name, email: member.email, uuid: session.user.id });
          }
        }
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // 관리자 보호 라우트
  const ProtectedAdminRoute = ({ children }) => {
    if (!adminInfo) {
      return <div style={{ padding: "2rem" }}>관리자 로그인이 필요합니다.</div>;
    }
    return children;
  };

  return (
    <>
      {/* 관리자 페이지에는 Header 숨김 */}
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
        />
      )}

      <Routes>
        {/* 일반 메인 페이지 */}
        <Route path="/" element={<Index cart={cart} setCart={setCart} />} />

        {/* 관리자 페이지 */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <Dashboard adminInfo={adminInfo} onLogout={handleLogout} />
            </ProtectedAdminRoute>
          }
        />
      </Routes>

      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          onLoginSuccess={(user) => {
            setUserInfo(user);
            setShowLogin(false);
          }}
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </>
  );
}

export default App;
