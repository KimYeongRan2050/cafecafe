import React from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import AdminLoginPopup from "../popup/AdminLoginPopup";

export default function AdminProtectedRoute({ children }) {
  const { adminInfo } = useAdminAuth();

  // 로그인 여부 판단
  if (!adminInfo) {
    return <AdminLoginPopup />;
  }

  return children;
}
