import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userService";

function AdminLoginPopup({ adminOnLogin, onClose, onLoginSuccess }) {
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await loginUser(email, pw);

      const isAdmin =
        user?.role === "admin" ||
        (email === "admin@mail.com" && pw === "123456");

      if (isAdmin) {
        if (typeof onLoginSuccess === "function") {
          onLoginSuccess(user);
        }
        alert("관리자 로그인 성공");
        onClose();
        navigate("/admin/dashboard");
      } else {
        alert("로그인 실패 또는 관리자 권한 없음");
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const scrolly = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `;

    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, scrolly);
    };
  }, []);  

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>관리자 로그인</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일"
            required
          />
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="비밀번호"
            required
          />
          <button type="submit">로그인</button>
        </form>
        <button onClick={onClose} className="close-btn">닫기</button>
      </div>
      
    </div>
  );
}

export default AdminLoginPopup;
