// src/routes/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminLoginPopup from "../admin/popup/AdminLoginPopup";

function ProtectedRoute({ children }) {
  const { adminUser, loading } = useAdminAuth();
  const [showLoginPopup, setShowLogingPopup] = useState(false);

  useEffect(() => {
    if(!loading && !adminUser){
      setShowLogingPopup(true);
    }
  }, [loading, adminUser]);

  if (loading) return <p>로딩 중...</p>;

  //로그인이 안 됐을 시 팝업
  if (!adminUser && showLoginPopup) {
    return (
      <div className="login-overlay">
        <AdminLoginPopup
          onClose={() => setShowLogingPopup(false)}
          onLoginSuccess={() => window.location.reload()}
        />
      </div>
    )
  }

  //로그인 되어 있으면 대시보드 표시
  return children;
}

export default ProtectedRoute;
