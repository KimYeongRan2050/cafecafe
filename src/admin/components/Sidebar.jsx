import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../styles/admin.css';

function Sidebar() {
  const location = useLocation();

  const menuList = [
    { to: "/admin/dashboard", icon: "bi bi-house-fill", label: "전체 현황" },
    { to: "/admin/product", icon: "bi bi-cup-hot-fill", label: "메뉴 관리" },
    { to: "/admin/supplies", icon: "bi bi-boxes", label: "바리스타 용품" },
    { to: "/admin/sales", icon: "bi bi-bar-chart-fill", label: "판매 현황" },
    { to: "/admin/member", icon: "bi bi-person-lines-fill", label: "회원 관리" },
    { to: "/admin/users", icon: "bi bi-person-vcard-fill", label: "직원 관리" },
  ];

  return(
    <>
      <div className="admin-logobox">
        <div className="admin-logo">로고</div>
        <h3>관리자대시보드</h3>
      </div>
      <div className="admin-menu">
        <ul>
          {menuList.map(menu => (
            <li
              key={menu.to}
              className={location.pathname.startsWith(menu.to) ? "on" : "off"}
            >
              <Link to={menu.to}>
                <i className={menu.icon}></i>
                <span>{menu.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
};

export default Sidebar;