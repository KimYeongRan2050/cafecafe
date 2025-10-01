import React, { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("adminInfo");
    if (stored) {
      setAdminInfo(JSON.parse(stored));
    }
  }, []);

  const login = (info) => {
    setAdminInfo(info);
    localStorage.setItem("adminInfo", JSON.stringify(info));
  };

  const logout = () => {
    setAdminInfo(null);
    localStorage.removeItem("adminInfo");
  };

  return (
    <AdminAuthContext.Provider value={{ adminInfo, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
