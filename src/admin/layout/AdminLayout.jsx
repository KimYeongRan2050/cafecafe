import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../services/supabaseClient";

function AdminLayout({ adminInfo: initialAdminInfo, onLogout }) {
  const [adminInfo, setAdminInfo] = useState(initialAdminInfo);

  // 최신 관리자 정보 다시 불러오기
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!initialAdminInfo?.email) return;
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, profile_img")
        .eq("email", initialAdminInfo.email)
        .single();

      if (!error && data) setAdminInfo(data);
    };

    fetchAdminProfile();
  }, [initialAdminInfo]);

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
