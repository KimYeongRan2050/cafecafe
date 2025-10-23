import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { getUserImageUrl } from "../../services/userImageService";
import "../styles/admin.css";

function Sidebar({ adminInfo, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  useEffect(() => {
    if (adminInfo?.profile_img) {
      const img = new Image();
      img.src = getUserImageUrl(adminInfo.profile_img);
    }
  }, [adminInfo]);

  const menuList = [
    { to: "/admin/dashboard", icon: "bi bi-house-fill", label: "전체 현황" },
    { to: "/admin/product", icon: "bi bi-cup-hot-fill", label: "메뉴 관리" },
    { to: "/admin/supplies", icon: "bi bi-boxes", label: "바리스타 용품" },
    { to: "/admin/sales", icon: "bi bi-bar-chart-fill", label: "판매 현황" },
    { to: "/admin/member", icon: "bi bi-person-lines-fill", label: "회원 관리" },
    { to: "/admin/users", icon: "bi bi-person-vcard-fill", label: "직원 관리" },
  ];

  return (
    <>
      <div className="admin-logobox">
        {adminInfo && (
          <div className="admin-info-wrapper">
            <div className="admin-profile-box">
              <img
                src={getUserImageUrl(adminInfo.profile_img)}
                alt="관리자 프로필"
                className="admin-profile"
              />
            </div>
            <div className="admin-info">
              <h3>{adminInfo.name} 님</h3>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i> 로그아웃
              </button>
            </div>
          </div>
        )}
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
  );
}

export default React.memo(Sidebar);
