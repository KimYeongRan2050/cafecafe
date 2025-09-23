import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard"
import ProductManage from "../pages/ProductManage";
import OrderManage from "../pages/OrderManage";
import SalesManage from "../pages/SalesManage";
import MemberManage from "../pages/MemberManage";
import UserManage from "../pages/UserManage";

function AdminRoutes({ member }) {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="product" element={<ProductManage />} />
      <Route path="supplies" element={<OrderManage />} />
      <Route path="sales" element={<SalesManage />} />
      <Route path="member" element={<MemberManage />} />
      <Route path="users" element={<UserManage />} />
    </Routes>
  );
}

export default AdminRoutes;