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
      <Route path="dashboard" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
      <Route path="product" element={<AdminProtectedRoute><ProductManage /></AdminProtectedRoute>} />
      <Route path="supplies" element={<AdminProtectedRoute><OrderManage /></AdminProtectedRoute>} />
      <Route path="sales" element={<AdminProtectedRoute><SalesManage /></AdminProtectedRoute>} />
      <Route path="member" element={<AdminProtectedRoute><MemberManage /></AdminProtectedRoute>} />
      <Route path="users" element={<AdminProtectedRoute><UserManage /></AdminProtectedRoute>} />
    </Routes>
  );
}

export default AdminRoutes;
