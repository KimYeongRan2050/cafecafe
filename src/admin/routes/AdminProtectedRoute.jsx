import React from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import AdminLoginPopup from "../popup/AdminLoginPopup";

export default function AdminProtectedRoute({ children }) {
  const { adminInfo  } = useAdminAuth();

  return adminInfo  ? children : <AdminLoginPopup />;
}
