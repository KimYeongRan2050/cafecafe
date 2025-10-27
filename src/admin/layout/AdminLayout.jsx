import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminLayout({ adminInfo, onLogout }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar-area">
        <Sidebar adminInfo={adminInfo} onLogout={onLogout} />
      </aside>

      <main className="admin-content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
