import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";

import Dashboard from "../pages/Dashboard";
import ProductManage from "../pages/ProductManage";
import OrderManage from "../pages/OrderManage";
import SalesManage from "../pages/SalesManage";
import MemberManage from "../pages/MemberManage";
import UserManage from "../pages/UserManage";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
      <Route path="/admin/product" element={<AdminProtectedRoute><ProductManage /></AdminProtectedRoute>} />
      <Route path="/admin/supplies" element={<AdminProtectedRoute><OrderManage /></AdminProtectedRoute>} />
      <Route path="/admin/sales" element={<AdminProtectedRoute><SalesManage /></AdminProtectedRoute>} />
      <Route path="/admin/member" element={<AdminProtectedRoute><MemberManage /></AdminProtectedRoute>} />
      <Route path="/admin/users" element={<AdminProtectedRoute><UserManage /></AdminProtectedRoute>} />
    </Routes>
  );
}

export default AdminRoutes;
