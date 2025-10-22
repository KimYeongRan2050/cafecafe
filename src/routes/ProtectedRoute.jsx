// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

function ProtectedRoute({ children }) {
  const { adminUser, loading } = useAdminAuth();

  if (loading) return <p>로딩 중...</p>;

  if (!adminUser) {
    alert("관리자 로그인이 필요합니다.");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
