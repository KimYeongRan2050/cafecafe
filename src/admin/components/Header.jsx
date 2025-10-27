import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate('/');
  };
  
  return(
    <div className="admin-header">
      <h2>관리자 대시보드</h2>
      <p>운영 현황을 관리하세요</p>
      <button onClick={goToHome}>홈페이지</button>
    </div>
  )
};

export default Header;