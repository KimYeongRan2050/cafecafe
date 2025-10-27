import React, { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);

  // 새로고침 시에도 유지
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminInfo");
    if (storedAdmin) {
      try {
        setAdminInfo(JSON.parse(storedAdmin));
      } catch (e) {
        localStorage.removeItem("adminInfo");
      }
    }
  }, []);

  // 로그인 시 Context + localStorage에 저장
  const login = (data) => {
    setAdminInfo(data);
    localStorage.setItem("adminInfo", JSON.stringify(data));
  };

  // 로그아웃
  const logout = () => {
    setAdminInfo(null);
    localStorage.removeItem("adminInfo");
    window.location.href = "/"; // 메인으로 이동
  };

  return (
    <AdminAuthContext.Provider value={{ adminInfo, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
