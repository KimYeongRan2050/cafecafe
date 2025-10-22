import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userService";
import { useAdminAuth } from "../../context/AdminAuthContext";

function AdminLoginPopup({onClose}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginUser(email, password);
      if (user.role === "admin") {
        login(user);
        setStatus("로그인 성공");
        navigate("/admin/dashboard");
      } else {
        setStatus("관리자 권한이 없습니다.");
      }
    } catch (err) {
      setStatus("로그인 실패: " + err.message);
    }
  };

  const handleClose = () => {
    navigate("/"); // 메인 페이지로 이동
  };  

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-content">
          <h3>관리자 로그인</h3>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="Inbutton"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="Inbutton"
              required
            />
            <p>{status}</p>
            <button type="submit">로그인</button>
          </form>
        </div>

        <button className="close-btn" onClick={onClose}>닫기</button>
        
      </div>
    </div>
  );
}

export default AdminLoginPopup;
